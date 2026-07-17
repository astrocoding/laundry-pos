import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    totalMachines,
    availableMachines,
    runningMachines,
    maintenanceMachines,
    todayOrders,
  ] = await Promise.all([
    prisma.machine.count(),
    prisma.machine.count({ where: { status: "AVAILABLE" } }),
    prisma.machine.count({ where: { status: "RUNNING" } }),
    prisma.machine.count({ where: { status: "MAINTENANCE" } }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Machines</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalMachines}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-green-500">
          <dt className="truncate text-sm font-medium text-gray-500">Available</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{availableMachines}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-sky-500">
          <dt className="truncate text-sm font-medium text-gray-500">Running</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{runningMachines}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-gray-500">
          <dt className="truncate text-sm font-medium text-gray-500">Maintenance</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{maintenanceMachines}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Today&apos;s Orders</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{todayOrders}</dd>
        </div>
      </dl>
    </div>
  );
}
