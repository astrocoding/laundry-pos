import { NextResponse } from "next/server";
import { requireUser } from "@/lib/permissions";
import { processCheckout } from "@/services/checkout.service";
import { syncMachineStatuses } from "@/lib/machine-sync";

export async function POST(req: Request) {
  try {
    await syncMachineStatuses();
    const user = await requireUser();
    const body = await req.json();
    const { machineId, pricingRuleId, idempotencyKey, customerName, paymentMethod } = body;

    if (!machineId || !pricingRuleId || !customerName || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await processCheckout({
      userId: user.id,
      machineId,
      pricingRuleId,
      idempotencyKey,
      customerName,
      paymentMethod,
    });

    return NextResponse.json({ success: true, orderId: result.order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    if (error instanceof Error && error.message === "MACHINE_NOT_AVAILABLE") {
      return NextResponse.json({ error: "Machine is no longer available" }, { status: 409 });
    }
    if (error instanceof Error && error.message === "PRICING_NOT_AVAILABLE") {
      return NextResponse.json({ error: "Invalid pricing rule selected" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
