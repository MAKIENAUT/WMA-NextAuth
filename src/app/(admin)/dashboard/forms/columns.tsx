// app/dashboard/forms/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export type Application = {
  _id: string;
  applicationId: string;
  first_name: string;
  last_name: string;
  email_address: string;
  country: string;
  profession: string;
  status: string;
  createdAt: string;
};

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "applicationId",
    header: "Application ID",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "email_address",
    header: "Email",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "profession",
    header: "Profession",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "approved"
              ? "bg-green-100 text-green-800"
              : status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "MMM dd, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;
      return (
        <Link href={`/dashboard/forms/${application._id}`}>
          <Button variant="outline" size="sm">
            View
          </Button>
        </Link>
      );
    },
  },
];