"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

export type PricingRuleData = {
  id: string;
  name: string;
  machineType: string;
  durationMinutes: number;
  priceNum: number;
  isActive: boolean;
};

export default function PricingTable({ rules }: { rules: PricingRuleData[] }) {
  const columns: ColumnDef<PricingRuleData>[] = [
    { key: "name", label: "Name", sortable: true },
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
  ];

  return (
    <DataTable
      data={rules}
      columns={columns}
      searchKey="name"
      searchPlaceholder="Search Rule Name..."
    />
  );
}
