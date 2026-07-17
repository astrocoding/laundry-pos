import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function processCheckout({
  userId,
  machineId,
  pricingRuleId,
  idempotencyKey,
}: {
  userId: string;
  machineId: string;
  pricingRuleId: string;
  idempotencyKey?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    // 1. Check idempotency
    if (idempotencyKey) {
      const existingOrder = await tx.order.findUnique({
        where: { idempotencyKey },
        include: { session: true, invoice: true },
      });
      if (existingOrder) return { order: existingOrder, session: existingOrder.session, invoice: existingOrder.invoice, serverNow: new Date() };
    }

    // 2. Fetch machine and ensure status is AVAILABLE
    // We lock the row for update using raw query or just rely on atomic update condition
    const machine = await tx.machine.findUnique({
      where: { id: machineId },
    });

    if (!machine || machine.status !== "AVAILABLE") {
      throw new Error("MACHINE_NOT_AVAILABLE");
    }

    // 3. Check for any active sessions just in case
    const activeSession = await tx.machineSession.findFirst({
      where: {
        machineId,
        status: { in: ["RESERVED", "RUNNING"] },
      },
    });

    if (activeSession) {
      throw new Error("MACHINE_NOT_AVAILABLE");
    }

    // 4. Fetch pricing rule
    const pricing = await tx.pricingRule.findUnique({
      where: { id: pricingRuleId },
    });

    if (!pricing || !pricing.isActive || pricing.machineType !== machine.type) {
      throw new Error("PRICING_NOT_AVAILABLE");
    }

    // 5. Fetch wallet and check balance
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance.lessThan(pricing.price)) {
      throw new Error("INSUFFICIENT_BALANCE");
    }

    // 6. Deduct balance
    const balanceBefore = wallet.balance.toNumber();
    const balanceAfter = balanceBefore - pricing.price.toNumber();

    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: balanceAfter },
    });

    await tx.walletLedger.create({
      data: {
        walletId: wallet.id,
        type: "PURCHASE",
        amount: pricing.price,
        balanceBefore,
        balanceAfter,
        referenceType: "ORDER",
      },
    });

    // 7. Create Order
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const order = await tx.order.create({
      data: {
        userId,
        machineId,
        pricingRuleId,
        status: "PAID",
        idempotencyKey: idempotencyKey || randomUUID(),
        serviceName: pricing.name,
        machineCode: machine.code,
        durationMinutes: pricing.durationMinutes,
        priceSnapshot: pricing.price,
        finalAmount: pricing.price,
        paidAt: new Date(),
      },
    });

    // 8. Create Session
    const serverNow = new Date();
    const endsAt = new Date(serverNow.getTime() + pricing.durationMinutes * 60000);

    const session = await tx.machineSession.create({
      data: {
        orderId: order.id,
        machineId,
        userId,
        status: "RUNNING",
        durationMinutes: pricing.durationMinutes,
        startedAt: serverNow,
        endsAt,
      },
    });

    // 9. Update machine status
    await tx.machine.update({
      where: { id: machineId },
      data: { status: "RUNNING" },
    });

    // 10. Create Invoice
    const invoiceNumber = `INV-${serverNow.toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    const invoice = await tx.invoice.create({
      data: {
        orderId: order.id,
        invoiceNumber,
        customerName: user.name,
        machineCode: machine.code,
        serviceName: pricing.name,
        durationMinutes: pricing.durationMinutes,
        subtotal: pricing.price,
        discount: 0,
        finalAmount: pricing.price,
        paymentMethod: "WALLET",
        status: "PAID",
      },
    });

    return { order, session, invoice, serverNow };
  });
}
