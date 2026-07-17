"use client";

import React, { useState } from "react";
import { Machine } from "@prisma/client";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import EditMachineModal from "./EditMachineModal";
import { deleteMachine } from "./actions";
import { Trash2 } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

export default function MachinesTable({ machines }: { machines: Machine[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(itemToDelete);
    try {
      const formData = new FormData();
      formData.append("id", itemToDelete);
      await deleteMachine(formData);
      setItemToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete machine");
    } finally {
      setIsDeleting(null);
    }
  };

  const columns: ColumnDef<Machine>[] = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "type", label: "Type", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            item.status === "AVAILABLE"
              ? "bg-green-100 text-green-800"
              : item.status === "RUNNING"
              ? "bg-blue-100 text-blue-800"
              : item.status === "MAINTENANCE"
              ? "bg-gray-100 text-gray-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <div className="flex space-x-3 items-center">
          <EditMachineModal machine={item} />
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
        data={machines}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search Machine Name..."
      />
      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        itemName="machine"
        isDeleting={isDeleting !== null}
      />
    </>
  );
}
