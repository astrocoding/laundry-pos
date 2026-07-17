import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";
import TransactionsTable, { OrderData } from "./TransactionsTable";

export default async function TransactionsPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { invoice: true },
  });

  const serializedOrders: OrderData[] = orders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    serviceName: o.serviceName,
    machineCode: o.machineCode,
    finalAmount: o.finalAmount.toNumber(),
    status: o.status,
    hasInvoice: !!o.invoice,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Transaction History</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your past transactions and invoices.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <TransactionsTable orders={serializedOrders} />
      </div>
    </div>
  );
}
