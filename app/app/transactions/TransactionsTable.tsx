"use client";

import React from "react";
import Link from "next/link";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

export type OrderData = {
  id: string;
  createdAt: string; // ISO String
  serviceName: string;
  machineCode: string;
  finalAmount: number;
  status: string;
  hasInvoice: boolean;
};

export default function TransactionsTable({ orders }: { orders: OrderData[] }) {
  const columns: ColumnDef<OrderData>[] = [
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (item) => {
        const d = new Date(item.createdAt);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
      },
    },
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
            item.status === "PAID"
              ? "bg-green-100 text-green-800"
              : item.status === "COMPLETED"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "hasInvoice",
      label: "Invoice",
      render: (item) =>
        item.hasInvoice ? (
          <Link
            href={`/app/transactions/${item.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            View Invoice
          </Link>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      searchKey="serviceName"
      searchPlaceholder="Search Service Name..."
    />
  );
}
