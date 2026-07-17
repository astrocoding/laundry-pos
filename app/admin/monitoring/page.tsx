import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { syncMachineStatuses } from "@/lib/machine-sync";
import MonitoringTable, { SessionData } from "./MonitoringTable";

export const dynamic = "force-dynamic";

export default async function AdminMonitoringPage() {
  await syncMachineStatuses();
  await requireAdmin();

  const sessions = await prisma.machineSession.findMany({
    where: { status: "RUNNING" },
    include: { machine: true, user: true },
    orderBy: { endsAt: "asc" },
  });

  const serializedSessions: SessionData[] = sessions.map((s) => ({
    id: s.id,
    machineCode: s.machine.code,
    machineName: s.machine.name,
    machineType: s.machine.type,
    customerName: s.user.name || "Unknown",
    customerPhone: s.user.phone || "-",
    endsAt: s.endsAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Live Machine Monitoring</h1>
          <p className="mt-2 text-sm text-gray-700">
            Real-time view of all currently running machines and their countdown timers.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <MonitoringTable sessions={serializedSessions} />
      </div>
    </div>
  );
}
