"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import TimerComponent from "@/components/TimerComponent";

export type SessionData = {
  id: string;
  machineCode: string;
  machineName: string;
  machineType: string;
  status: string;
  cashierName: string;
  customerName: string | null;
  paymentMethod: string;
  finalAmount: number;
  startedAt: string;
  endsAt: string;
};

export default function MonitoringTable({ sessions }: { sessions: SessionData[] }) {
  const columns: ColumnDef<SessionData>[] = [
    {
      key: "machineCode",
      label: "Machine",
      sortable: true,
      render: (item) => (
        <span className="font-medium">
          {item.machineCode} <span className="text-gray-400 font-normal">— {item.machineName}</span>
        </span>
      ),
    },
    { key: "machineType", label: "Type", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            item.status === "RUNNING"
              ? "bg-sky-100 text-sky-800"
              : item.status === "COMPLETED"
              ? "bg-green-100 text-green-800"
              : item.status === "CANCELED"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "cashierName",
      label: "Cashier",
      sortable: true,
      render: (item) => <span className="text-gray-700">{item.cashierName}</span>,
    },
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
      render: (item) =>
        item.customerName || <span className="text-gray-400 text-xs">—</span>,
    },
    {
      key: "finalAmount",
      label: "Amount",
      sortable: true,
      render: (item) => (
        <span className="font-medium">Rp {item.finalAmount.toLocaleString("id-ID")}</span>
      ),
    },
    {
      key: "remainingTime",
      label: "Time Remaining",
      render: (item) =>
        item.status === "RUNNING" ? (
          <TimerComponent endsAt={item.endsAt} />
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        ),
    },
    {
      key: "startedAt",
      label: "Started",
      sortable: true,
      render: (item) =>
        new Date(item.startedAt).toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "endsAt",
      label: "End Time",
      sortable: true,
      render: (item) =>
        new Date(item.endsAt).toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  return (
    <DataTable
      data={sessions}
      columns={columns}
      searchKey="machineCode"
      searchPlaceholder="Search machine code, cashier, or customer..."
    />
  );
}
