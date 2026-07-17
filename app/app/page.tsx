import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";
import { syncMachineStatuses } from "@/lib/machine-sync";
import Link from "next/link";
import DashboardSessionStatus from "@/components/DashboardSessionStatus";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  await syncMachineStatuses();
  const user = await requireUser();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    myRevenueRaw,
    myOrdersToday,
    availableMachines,
    runningMachines,
    activeSessions,
    recentTransactions,
  ] = await Promise.all([
    // Sales/revenue for the logged-in cashier only (all time, COMPLETED orders)
    prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: { userId: user.id, status: "COMPLETED" },
    }),
    // Jumlah order harian cashier yang login
    prisma.order.count({
      where: {
        userId: user.id,
        createdAt: { gte: todayStart },
      },
    }),
    // Total mesin available
    prisma.machine.count({ where: { status: "AVAILABLE", isActive: true } }),
    // Total mesin running
    prisma.machine.count({ where: { status: "RUNNING" } }),
    // Active sessions 24 jam terakhir
    prisma.machineSession.findMany({
      where: {
        status: { in: ["RUNNING", "COMPLETED"] },
        startedAt: { gte: twentyFourHoursAgo },
      },
      include: { machine: true },
      orderBy: { startedAt: "desc" },
      take: 10,
    }),
    // Recent transactions cashier yang login
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const myRevenue = myRevenueRaw._sum.finalAmount?.toNumber() || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Hello, {user.name} 👋
      </h1>

      {/* Stats Cards */}
      <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-green-500">
          <dt className="truncate text-sm font-medium text-gray-500">My Sales (All Time)</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            Rp {myRevenue.toLocaleString("id-ID")}
          </dd>
          <p className="mt-1 text-xs text-gray-400">Completed orders only</p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-sky-500">
          <dt className="truncate text-sm font-medium text-gray-500">My Orders Today</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {myOrdersToday}
          </dd>
          <p className="mt-1 text-xs text-gray-400">Transactions since midnight</p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-emerald-400">
          <dt className="truncate text-sm font-medium text-gray-500">Available Machines</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {availableMachines}
          </dd>
          <p className="mt-1 text-xs text-gray-400">Ready to use</p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-orange-400">
          <dt className="truncate text-sm font-medium text-gray-500">Running Machines</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {runningMachines}
          </dd>
          <p className="mt-1 text-xs text-gray-400">Currently in use</p>
        </div>
      </dl>

      {/* Active Sessions */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-green-500">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate mb-4">
              Active Machines (24h)
            </dt>
            {activeSessions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {activeSessions.map((session) => (
                  <li key={session.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session.machine.name} ({session.machine.code})
                      </p>
                      <p className="text-sm text-gray-500">
                        <DashboardSessionStatus
                          initialStatus={session.status}
                          endsAt={session.endsAt.toISOString()}
                        />
                      </p>
                    </div>
                    <Link
                      href="/app/monitor"
                      className="text-sm text-sky-600 hover:text-sky-900"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No active machines running.</p>
                <div className="mt-4">
                  <Link
                    href="/app/machines"
                    className="inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
                  >
                    Start a Wash
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-sky-500">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <dt className="text-sm font-medium text-gray-500">Recent My Transactions</dt>
              <Link href="/app/transactions" className="text-xs text-sky-600 hover:text-sky-900">
                View all →
              </Link>
            </div>
            {recentTransactions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentTransactions.map((order) => (
                  <li key={order.id}>
                    <Link href={`/app/transactions`} className="block hover:bg-gray-50 -mx-2 px-2 rounded">
                      <div className="py-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-sky-600 truncate">{order.serviceName}</p>
                          <span
                            className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "RUNNING"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>Machine: {order.machineCode}</span>
                          <span className="font-medium text-gray-700">
                            Rp {order.finalAmount.toNumber().toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-6 text-sm text-gray-500">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
