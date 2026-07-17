import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  await requireOwner();

  const [
    totalRevenueRaw,
    totalOrders,
    usersCount,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: { status: "COMPLETED" },
    }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.user.count({ where: { role: "USER" } }),
  ]);

  const totalRevenue = totalRevenueRaw._sum.finalAmount?.toNumber() || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Owner Dashboard</h1>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-green-500">
          <dt className="truncate text-sm font-medium text-gray-500">Total Revenue</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-blue-500">
          <dt className="truncate text-sm font-medium text-gray-500">Total Completed Orders</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalOrders}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-purple-500">
          <dt className="truncate text-sm font-medium text-gray-500">Total Customers</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{usersCount}</dd>
        </div>
      </dl>
    </div>
  );
}
