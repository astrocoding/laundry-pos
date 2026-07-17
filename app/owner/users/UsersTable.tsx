"use client";

import React from "react";
import { User } from "@prisma/client";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { updateUserRole } from "./actions";

export default function UsersTable({ users }: { users: User[] }) {
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
      render: (item) => (item.isActive ? "Active" : "Suspended"),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <form action={updateUserRole} className="flex space-x-2">
          <input type="hidden" name="id" value={item.id} />
          <select
            name="role"
            defaultValue={item.role}
            className="block w-full rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 border"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OWNER">OWNER</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center rounded border border-transparent bg-sky-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Update
          </button>
        </form>
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      searchKey="name"
      searchPlaceholder="Search Name..."
    />
  );
}
