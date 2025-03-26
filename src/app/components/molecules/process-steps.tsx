import React from "react";
import ContentCard from "@/components/atoms/content-card";

interface ProcessStepProps {
  stepNumber: number;
  title: string;
  description: string;
}

export default function ProcessSteps({
  stepNumber,
  title,
  description,
}: ProcessStepProps) {
  return (
    <div className="flex flex-col gap-2 lg:gap-4">
      <h3 className="text-xl font-semibold text-teal-800 sm:text-2xl lg:text-3xl">
        {stepNumber}. {title}
      </h3>
      <ContentCard description={description} />
    </div>
  );
}
