"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import TimerComponent from "@/components/TimerComponent";

export type MonitorSessionData = {
  id: string;
  machineCode: string;
  machineName: string;
  machineType: string;
  status: string;
  endsAt: string; // ISO string
};

export default function MonitorTable({ sessions }: { sessions: MonitorSessionData[] }) {
  const columns: ColumnDef<MonitorSessionData>[] = [
    {
      key: "machineCode",
      label: "Machine",
      sortable: true,
      render: (item) => `${item.machineCode} - ${item.machineName}`,
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
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "remainingTime",
      label: "Time Remaining",
      render: (item) =>
        item.status === "RUNNING" ? (
          <TimerComponent endsAt={item.endsAt} />
        ) : (
          "-"
        ),
    },
    {
      key: "endsAt",
      label: "End Time",
      sortable: true,
      render: (item) => new Date(item.endsAt).toLocaleTimeString(),
    },
  ];

  return (
    <DataTable
      data={sessions}
      columns={columns}
      searchKey="machineCode"
      searchPlaceholder="Search Machine Code..."
    />
  );
}
