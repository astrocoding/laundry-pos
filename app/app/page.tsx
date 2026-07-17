import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";
import { syncMachineStatuses } from "@/lib/machine-sync";
import Link from "next/link";
import DashboardSessionStatus from "@/components/DashboardSessionStatus";

export default async function UserDashboardPage() {
  await syncMachineStatuses();
  const user = await requireUser();

  // eslint-disable-next-line react-hooks/purity
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const activeSessions = await prisma.machineSession.findMany({
    where: {
      userId: user.id,
      status: { in: ["RUNNING", "COMPLETED"] },
      startedAt: { gte: twentyFourHoursAgo },
    },
    include: {
      machine: true,
    },
  });

  const recentTransactions = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Hello, {user.name}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-green-500 lg:col-span-3">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate mb-4">Active Machines</dt>
            {activeSessions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {activeSessions.map((session) => {
                  const isRunning = session.status === "RUNNING";
                  return (
                  <li key={session.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.machine.name} ({session.machine.code})</p>
                      <p className="text-sm text-gray-500">
                        <DashboardSessionStatus 
                          initialStatus={session.status} 
                          endsAt={session.endsAt.toISOString()} 
                        />
                      </p>
                    </div>
                    <Link
                      href={`/app/monitor`}
                      className="text-sm text-sky-600 hover:text-sky-900"
                    >
                      View
                    </Link>
                  </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No active machines running.
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
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((order) => (
                <li key={order.id}>
                  <Link href={`/app/transactions`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-sky-600 truncate">{order.serviceName}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {order.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Machine: {order.machineCode}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Rp {order.finalAmount.toNumber().toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-gray-500 text-sm">No recent transactions</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
