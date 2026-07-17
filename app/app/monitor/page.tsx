import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";
import Link from "next/link";
import MonitorTable, { MonitorSessionData } from "./MonitorTable";

export default async function MonitorPage() {
  const user = await requireUser();

  const sessions = await prisma.machineSession.findMany({
    where: { userId: user.id },
    include: { machine: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const serializedSessions: MonitorSessionData[] = sessions.map((s) => ({
    id: s.id,
    machineCode: s.machine.code,
    machineName: s.machine.name,
    machineType: s.machine.type,
    status: s.status,
    endsAt: s.endsAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Machine Monitor</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor the status and remaining time for your laundry sessions.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/app/machines"
            className="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Start New Wash
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <MonitorTable sessions={serializedSessions} />
      </div>
    </div>
  );
}
