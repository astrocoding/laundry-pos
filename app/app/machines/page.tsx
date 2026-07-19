import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";
import { syncMachineStatuses } from "@/lib/machine-sync";
import { formatTime } from "@/lib/format";
import Link from "next/link";
import { Machine, MachineSession } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Select Machine" };

export default async function UserMachinesPage() {
  await syncMachineStatuses();
  await requireUser();

  const machines = await prisma.machine.findMany({
    where: { isActive: true, status: { not: "OFFLINE" } },
    orderBy: [{ type: "asc" }, { code: "asc" }],
    include: {
      sessions: {
        where: { status: "RUNNING" },
      },
    }
  });

  const washers = machines.filter((m) => m.type === "WASHER");
  const dryers = machines.filter((m) => m.type === "DRYER");

  const renderMachineCard = (machine: Machine & { sessions: MachineSession[] }) => {
    const isAvailable = machine.status === "AVAILABLE";
    const isRunning = machine.status === "RUNNING";
    const session = isRunning ? machine.sessions[0] : null;

    return (
      <div
        key={machine.id}
        className={`relative flex flex-col overflow-hidden rounded-lg border shadow-sm ${
          isAvailable ? "border-green-200 bg-white" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex flex-1 flex-col p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-900">{machine.code} - {machine.name}</h3>
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                isAvailable ? "bg-green-100 text-green-700" :
                isRunning ? "bg-sky-100 text-sky-700" :
                machine.status === "RESERVED" ? "bg-yellow-100 text-yellow-700" :
                "bg-gray-100 text-gray-700"
              }`}
            >
              {machine.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 flex-1">
            {machine.capacityKg} kg capacity • {machine.locationZone}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            {isAvailable ? (
              <Link
                href={`/app/checkout?machineId=${machine.id}`}
                className="w-full text-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                Select & Pay
              </Link>
            ) : isRunning && session ? (
              <div className="w-full text-center rounded-md bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 ring-1 ring-inset ring-sky-700/10">
                Ends at {formatTime(session.endsAt)}
              </div>
            ) : (
              <div className="w-full text-center rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-500 ring-1 ring-inset ring-gray-500/10">
                Unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Available Machines</h1>
          <p className="mt-2 text-sm text-gray-700">
            Select an available machine to start your laundry. If all machines are full, you can join the queue.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Washers</h2>
            {washers.every(m => m.status !== "AVAILABLE") && (
              <Link href="/app/queue/join?type=WASHER" className="text-sm text-sky-600 hover:text-sky-500 font-medium">
                Join Washer Queue &rarr;
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            {washers.map(renderMachineCard)}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Dryers</h2>
            {dryers.every(m => m.status !== "AVAILABLE") && (
              <Link href="/app/queue/join?type=DRYER" className="text-sm text-sky-600 hover:text-sky-500 font-medium">
                Join Dryer Queue &rarr;
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            {dryers.map(renderMachineCard)}
          </div>
        </section>
      </div>
    </div>
  );
}
