// app/dashboard/forms/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/molecules/data-table";
import { columns } from "./columns";
import { Button } from "@/components/atoms/ui/button";
import { Loader2 } from "lucide-react";

type Application = {
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

export default function FormsDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/forms/j1-visa-application");
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data.applications);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">J1 Visa Applications</h1>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={applications}
          searchKey="last_name"
        />
      </div>
    </div>
  );
}