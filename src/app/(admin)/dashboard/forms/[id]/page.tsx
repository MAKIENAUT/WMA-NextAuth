// app/dashboard/forms/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/atoms/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type Application = {
  _id: string;
  applicationId: string;
  first_name: string;
  last_name: string;
  full_address: string;
  country: string;
  phone_number: string;
  email_address: string;
  profession: string;
  other_profession: string;
  resumePath: string;
  passportPath: string;
  confirm_eligibility: string;
  terms_and_condition: boolean;
  status: string;
  createdAt: string;
};

export default function ApplicationDetail() {
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/forms/j1-visa-application/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch application");
        }
        const data = await response.json();
        setApplication(data.application);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params.id]);

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

  if (!application) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Application not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard/forms">
          <Button variant="outline">Back to Applications</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          Application: {application.applicationId}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {application.first_name} {application.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{application.full_address}</p>
                <p className="font-medium">{application.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Profession</p>
                <p className="font-medium">
                  {application.profession}
                  {application.other_profession &&
                    ` (${application.other_profession})`}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{application.phone_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{application.email_address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Eligibility Confirmed</p>
                <p className="font-medium">
                  {application.confirm_eligibility === "yes" ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Resume</p>
                <a
                  href={application.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passport</p>
                <a
                  href={application.passportPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Passport
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Application Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      application.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : application.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {application.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-medium">
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Terms Accepted</p>
                <p className="font-medium">
                  {application.terms_and_condition ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button variant="default">Approve</Button>
          <Button variant="destructive">Reject</Button>
          <Button variant="outline">Download All</Button>
        </div>
      </div>
    </div>
  );
}