import { ReactNode } from "react";

export default function FormContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 sm:gap-3 md:gap-4">
      {children}
    </div>
  );
}