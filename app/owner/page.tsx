import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/permissions";
import OwnerTransactionsTable, { OwnerOrderData } from "./OwnerTransactionsTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Owner Dashboard" };

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  await requireOwner();

  const [
    totalRevenueRaw,
    totalOrders,
    cashierCount,
    adminCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: { status: { in: ["PAID", "RUNNING", "COMPLETED"] } },
    }),
    prisma.order.count({ where: { status: { in: ["PAID", "RUNNING", "COMPLETED"] } } }),
    prisma.user.count({ where: { role: "CASHIER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
  ]);

  const totalRevenue = totalRevenueRaw._sum.finalAmount?.toNumber() || 0;

  const ordersData: OwnerOrderData[] = recentOrders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    cashierName: o.user.name,
    serviceName: o.serviceName,
    machineCode: o.machineCode,
    finalAmount: o.finalAmount.toNumber(),
    status: o.status,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Owner Dashboard</h1>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-green-500">
          <dt className="truncate text-sm font-medium text-gray-500">Total Revenue</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-sky-500">
          <dt className="truncate text-sm font-medium text-gray-500">Total Paid Orders</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalOrders}</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-purple-500">
          <dt className="truncate text-sm font-medium text-gray-500">Total Cashier</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{cashierCount}</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-orange-400">
          <dt className="truncate text-sm font-medium text-gray-500">Total Admin</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{adminCount}</dd>
        </div>
      </dl>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">All Transactions</h2>
        <OwnerTransactionsTable orders={ordersData} />
      </div>
    </div>
  );
}
