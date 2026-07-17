import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/permissions";
import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";

export const dynamic = "force-dynamic";

export default async function OwnerUsersPage() {
  await requireOwner();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all cashiers, admins, and owners in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <AddUserModal />
        </div>
      </div>
      <div className="mt-8">
        <UsersTable users={users} />
      </div>
    </div>
  );
}
