import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/permissions";
import { syncMachineStatuses } from "@/lib/machine-sync";
import OwnerMonitorTable, { OwnerMonitorSessionData } from "./OwnerMonitorTable";

export const dynamic = "force-dynamic";

export default async function OwnerMonitorPage() {
  await requireOwner();
  await syncMachineStatuses();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [sessions, stats] = await Promise.all([
    prisma.machineSession.findMany({
      include: {
        machine: true,
        order: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { startedAt: "desc" },
      take: 100,
    }),
    Promise.all([
      prisma.machineSession.count({ where: { status: "RUNNING" } }),
      prisma.machineSession.count({ where: { status: "COMPLETED", startedAt: { gte: todayStart } } }),
      prisma.order.aggregate({
        _sum: { finalAmount: true },
        where: { status: "COMPLETED", createdAt: { gte: todayStart } },
      }),
      prisma.machine.count({ where: { status: "AVAILABLE", isActive: true } }),
    ]),
  ]);

  const [runningCount, completedToday, revenueToday, availableCount] = stats;
  const revenueTodayNum = revenueToday._sum.finalAmount?.toNumber() || 0;

  const serialized: OwnerMonitorSessionData[] = sessions.map((s) => ({
    id: s.id,
    machineCode: s.machine.code,
    machineName: s.machine.name,
    machineType: s.machine.type,
    status: s.status,
    cashierName: s.order.user.name,
    customerName: s.order.customerName ?? null,
    paymentMethod: s.order.paymentMethod,
    finalAmount: s.order.finalAmount.toNumber(),
    startedAt: s.startedAt.toISOString(),
    endsAt: s.endsAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Machine Monitor</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track all laundry sessions across all cashiers — real-time and full history.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-sky-500">
          <dt className="truncate text-sm font-medium text-gray-500">Running Now</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{runningCount}</dd>
          <p className="mt-1 text-xs text-gray-400">Currently active machines</p>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-green-500">
          <dt className="truncate text-sm font-medium text-gray-500">Available Machines</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{availableCount}</dd>
          <p className="mt-1 text-xs text-gray-400">Ready to use</p>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-purple-500">
          <dt className="truncate text-sm font-medium text-gray-500">Completed Today</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{completedToday}</dd>
          <p className="mt-1 text-xs text-gray-400">Sessions completed today</p>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border-l-4 border-orange-400">
          <dt className="truncate text-sm font-medium text-gray-500">Revenue Today</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            Rp {revenueTodayNum.toLocaleString("id-ID")}
          </dd>
          <p className="mt-1 text-xs text-gray-400">Revenue today</p>
        </div>
      </dl>

      {/* Session Table */}
      <OwnerMonitorTable sessions={serialized} />
    </div>
  );
}
