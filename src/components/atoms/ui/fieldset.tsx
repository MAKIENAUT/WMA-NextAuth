import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldsetProps {
  children: ReactNode;
  className?: string;
}

const Fieldset: React.FC<FieldsetProps> = ({ children, className }) => {
  return (
    <fieldset className={cn("rounded-lg border border-wma-darkTeal p-6 shadow-sm", className)}>
      {children}
    </fieldset>
  );
};

export { Fieldset };