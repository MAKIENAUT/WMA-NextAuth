import React from "react";
import { Button } from "@/components/atoms/ui/button";
import Link from "next/link";

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  href?: string;
}

export default function CallToAction({
  title,
  description,
  buttonText,
  onButtonClick,
  href = "#",
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
        {href && href !== "#" ? (
          <Link href={href}>
            <Button variant="service" onClick={onButtonClick} className="">
              {buttonText}
            </Button>
          </Link>
        ) : (
          <Button variant="service" onClick={onButtonClick} className="">
            {buttonText}
          </Button>
        )}
      </div>
    </footer>
  );
}
