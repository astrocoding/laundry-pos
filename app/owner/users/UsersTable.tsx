"use client";

import React, { useState } from "react";
import { User } from "@prisma/client";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { deleteUser } from "./actions";
import { Trash2 } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import EditUserModal from "./EditUserModal";

export default function UsersTable({ users }: { users: User[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(itemToDelete);
    try {
      const formData = new FormData();
      formData.append("id", itemToDelete);
      await deleteUser(formData);
      setItemToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "phone", label: "Phone", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            item.role === "OWNER"
              ? "bg-purple-100 text-purple-800"
              : item.role === "ADMIN"
              ? "bg-sky-100 text-sky-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.role}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {item.isActive ? "Active" : "Suspended"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <div className="flex space-x-3 items-center">
          <EditUserModal user={item} />
          <button
            onClick={() => setItemToDelete(item.id)}
            disabled={isDeleting === item.id}
            className="text-red-600 hover:text-red-900 flex items-center font-medium disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting === item.id ? "..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search Name..."
      />
      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        itemName="user"
        isDeleting={isDeleting !== null}
      />
    </>
  );
}
