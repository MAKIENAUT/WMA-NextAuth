import React from "react";
import { Button } from "@/components/atoms/ui/button";

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function CallToAction({
  title,
  description,
  buttonText,
  onButtonClick,
}: CallToActionProps) {
  return (
    <footer className="border-t border-gray-200 pt-6">
      <div className="flex flex-col items-center gap-6">
        <div className="inline-flex flex-col gap-2 text-center">
          <h4 className="text-2xl font-bold text-teal-800 sm:text-3xl lg:text-4xl">
            {title}
          </h4>
          <p className="lg:text-lg">{description}</p>
        </div>
        <Button variant="service" onClick={onButtonClick} className="">
          {buttonText}
        </Button>
      </div>
    </footer>
  );
}
