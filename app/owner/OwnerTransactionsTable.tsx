"use client";
import { formatDateTime } from "@/lib/format";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

export type OwnerOrderData = {
  id: string;
  createdAt: string; // ISO String
  cashierName: string;
  serviceName: string;
  machineCode: string;
  finalAmount: number;
  status: string;
};

export default function OwnerTransactionsTable({ orders }: { orders: OwnerOrderData[] }) {
  const columns: ColumnDef<OwnerOrderData>[] = [
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (item) => {
        const d = new Date(item.createdAt);
        return formatDateTime(d);
      },
    },
    { key: "cashierName", label: "Cashier", sortable: true },
    { key: "serviceName", label: "Service", sortable: true },
    { key: "machineCode", label: "Machine", sortable: true },
    {
      key: "finalAmount",
      label: "Amount",
      sortable: true,
      render: (item) => `Rp ${item.finalAmount.toLocaleString("id-ID")}`,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            item.status === "PAID" || item.status === "COMPLETED"
              ? "bg-green-100 text-green-800"
              : item.status === "RUNNING"
              ? "bg-sky-100 text-sky-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      searchPlaceholder="Search transactions..."
      searchKey="serviceName"
    />
  );
}
