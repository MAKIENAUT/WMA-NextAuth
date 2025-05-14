"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/atoms/ui/form";
import { Button } from "@/components/atoms/ui/button";
import J1FormLayout from "@/components/organisms/j1-form-layout";
import PersonalInfoSection from "@/components/molecules/personal-info-section";
import { ContactInfoSection } from "@/components/molecules/contact-info-section";
import { FileUploadSection } from "@/components/molecules/file-upload-section";
import { EligibilitySection } from "@/components/molecules/eligibility-section";
import { PrivacyPolicySection } from "@/components/molecules/privacy-policy-section";
import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/components/atoms/ui/use-toast";
import { Toaster } from "@/components/atoms/ui/toaster";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  country: z.string().min(1, "Country is required"),
  full_address: z.string().min(1, "Address is required"),
  profession: z.string().min(1, "Profession is required"),
  other_profession: z.string().optional(),
  phone_number: z.string().min(1, "Phone number is required"),
  email_address: z.string().email("Invalid email address"),
  resume: z
    .any()
    .refine(
      (files) =>
        files instanceof FileList && files.length > 0 && files[0].size > 0,
      "Resume is required"
    ),
  passport: z
    .any()
    .refine(
      (files) =>
        files instanceof FileList && files.length > 0 && files[0].size > 0,
      "Passport is required"
    ),
  confirm_eligibility: z.string().min(1, "Please confirm your eligibility"),
  terms_and_condition: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export default function J1VisaApplication() {
  const [showOtherProfession, setShowOtherProfession] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [passportFileName, setPassportFileName] = useState<string | null>(null);
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      country: "",
      full_address: "",
      profession: "",
      other_profession: "",
      phone_number: "",
      email_address: "",
      confirm_eligibility: "",
      terms_and_condition: false,
    },
  });

  const sectionDefinitions = [
    {
      name: "Personal Information",
      step: 1,
      fields: [
        "first_name",
        "last_name",
        "country",
        "full_address",
        "profession",
      ],
      isComplete: (values: any) => {
        if (values.profession === "Other") {
          return !!(
            values.first_name &&
            values.last_name &&
            values.country &&
            values.full_address &&
            values.profession &&
            values.other_profession
          );
        }
        return !!(
          values.first_name &&
          values.last_name &&
          values.country &&
          values.full_address &&
          values.profession
        );
      },
    },
    {
      name: "Contact Information",
      step: 2,
      fields: ["phone_number", "email_address"],
      isComplete: (values: any) =>
        !!(values.phone_number && values.email_address),
    },
    {
      name: "File Upload",
      step: 3,
      fields: ["resume", "passport"],
      isComplete: (values: any, state: any) =>
        !!(state.resumeFileName && state.passportFileName),
    },
    {
      name: "Eligibility",
      step: 4,
      fields: ["confirm_eligibility"],
      isComplete: (values: any) => !!values.confirm_eligibility,
    },
    {
      name: "Privacy Policy",
      step: 5,
      fields: ["terms_and_condition"],
      isComplete: (values: any) => !!values.terms_and_condition,
    },
  ];

  const watchedValues = form.watch();

  useEffect(() => {
    if (Object.keys(form.formState.touchedFields).length > 0) {
      setFormTouched(true);
    }
  }, [form.formState.touchedFields]);

  const { errors } = form.formState;

  const sectionStatus = sectionDefinitions.map((section) => ({
    name: section.name,
    step: section.step,
    completed: section.isComplete(watchedValues, {
      resumeFileName,
      passportFileName,
    }),
  }));

  const completedSections = sectionStatus.filter(
    (section) => section.completed
  ).length;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const allSectionsComplete = sectionDefinitions.every((section) =>
        section.isComplete(values, { resumeFileName, passportFileName })
      );

      if (!allSectionsComplete) {
        const firstIncompleteSection = sectionDefinitions.find(
          (section) =>
            !section.isComplete(values, { resumeFileName, passportFileName })
        );

        toast({
          variant: "destructive",
          title: "Error",
          description: `Please complete all required fields in the ${firstIncompleteSection?.name || "required"} section.`,
        });

        if (firstIncompleteSection?.fields.length) {
          form.setFocus(firstIncompleteSection.fields[0] as any);
        }
        return;
      }

      // Create FormData object for multipart/form-data submission
      const formData = new FormData();

      // Add all text fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "resume" || key === "passport") {
          if (value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]);
          }
        } else if (key === "terms_and_condition") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      });

      // Make API request
      const response = await fetch("/api/forms/j1-visa-application", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to submit application");
      }

      // Handle successful submission
      if (responseData.application?.applicationId) {
        setApplicationId(responseData.application.applicationId);
        toast({
          title: "Application submitted successfully!",
          description: `Your application ID is: ${responseData.application.applicationId}. Please save this ID for future reference.`,
        });
      } else {
        toast({
          title: "Application submitted successfully!",
        });
      }

      // Reset form state
      form.reset();
      setResumeFileName(null);
      setPassportFileName(null);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Toaster />
      <J1FormLayout
        firstName={watchedValues.first_name || "Applicant"}
        completedSections={completedSections}
        totalSections={sectionStatus.length}
        sectionStatus={sectionStatus}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoSection
              control={form.control}
              showOtherProfession={showOtherProfession}
              setShowOtherProfession={setShowOtherProfession}
            />

            <ContactInfoSection control={form.control} />

            <FileUploadSection
              control={form.control}
              resumeFileName={resumeFileName}
              passportFileName={passportFileName}
              setResumeFileName={setResumeFileName}
              setPassportFileName={setPassportFileName}
            />

            <EligibilitySection control={form.control} />

            <PrivacyPolicySection control={form.control} />

            <div className="flex justify-end">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
                <div className="text-sm text-gray-600">
                  {formTouched && (
                    <>
                      <span className="font-medium">{completedSections}</span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {sectionStatus.length}
                      </span>{" "}
                      sections completed
                    </>
                  )}
                </div>
                <Button
                  type="submit"
                  className="bg-wma-darkTeal hover:bg-wma-teal text-white px-8 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </J1FormLayout>
    </>
  );
}
