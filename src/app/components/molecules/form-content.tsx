import { ReactNode } from "react";

export default function FormContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 sm:gap-4 md:gap-6">
      {children}
    </div>
  );
}
