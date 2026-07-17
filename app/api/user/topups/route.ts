import { NextResponse } from "next/server";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const amount = Number(body.amount);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const balanceBefore = wallet.balance.toNumber();
    const balanceAfter = balanceBefore + amount;

    // Use transaction to ensure data integrity
    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      });

      await tx.walletLedger.create({
        data: {
          walletId: wallet.id,
          type: "TOPUP",
          amount: amount,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          referenceType: "SIMULATED_TOPUP",
          createdById: user.id,
        },
      });
    });

    return NextResponse.json({ success: true, balance: balanceAfter });
  } catch (error) {
    console.error("Topup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
