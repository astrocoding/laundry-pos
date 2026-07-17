import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { syncMachineStatuses } from "@/lib/machine-sync";
import MachinesTable from "./MachinesTable";
import AddMachineModal from "./AddMachineModal";

export default async function AdminMachinesPage() {
  await syncMachineStatuses();
  await requireAdmin();

  const machines = await prisma.machine.findMany({
    orderBy: [{ type: 'asc' }, { code: 'asc' }],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Machines</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all machines including their status, type, and location.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <AddMachineModal />
        </div>
      </div>
      <div className="mt-8">
        <MachinesTable machines={machines} />
      </div>
    </div>
  );
}
