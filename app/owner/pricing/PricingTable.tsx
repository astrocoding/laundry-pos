"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import EditPricingModal from "./EditPricingModal";
import { deletePricingRule } from "./actions";
import { Trash2 } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

export type PricingRuleData = {
  id: string;
  name: string;
  serviceType: string;
  machineType: string;
  durationMinutes: number;
  priceNum: number;
  isActive: boolean;
};

export default function PricingTable({ rules }: { rules: PricingRuleData[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(itemToDelete);
    try {
      const formData = new FormData();
      formData.append("id", itemToDelete);
      await deletePricingRule(formData);
      setItemToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete pricing rule");
    } finally {
      setIsDeleting(null);
    }
  };

  const columns: ColumnDef<PricingRuleData>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "serviceType", label: "Service", sortable: true },
    { key: "machineType", label: "Machine Type", sortable: true },
    { key: "durationMinutes", label: "Duration (mins)", sortable: true },
    {
      key: "priceNum",
      label: "Price",
      sortable: true,
      render: (item) => `Rp ${item.priceNum.toLocaleString("id-ID")}`,
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            item.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <div className="flex space-x-3 items-center">
          <EditPricingModal rule={item} />
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
        data={rules}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search Rule Name..."
      />
      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        itemName="pricing rule"
        isDeleting={isDeleting !== null}
      />
    </>
  );
}
