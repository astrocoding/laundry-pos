"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import TimerComponent from "@/components/TimerComponent";

export type SessionData = {
  id: string;
  machineCode: string;
  machineName: string;
  machineType: string;
  customerName: string;
  customerPhone: string;
  endsAt: string; // ISO string
};

export default function MonitoringTable({ sessions }: { sessions: SessionData[] }) {
  const columns: ColumnDef<SessionData>[] = [
    {
      key: "machineCode",
      label: "Machine",
      sortable: true,
      render: (item) => `${item.machineCode} - ${item.machineName}`,
    },
    { key: "machineType", label: "Type", sortable: true },
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
      render: (item) => `${item.customerName} (${item.customerPhone})`,
    },
    {
      key: "remainingTime",
      label: "Remaining Time",
      render: (item) => <TimerComponent endsAt={item.endsAt} />,
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
