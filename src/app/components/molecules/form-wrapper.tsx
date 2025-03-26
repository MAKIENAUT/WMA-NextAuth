import { FormEventHandler, ReactNode } from "react";

export default function FormWrapper({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-6">
      {children}
    </form>
  );
}
