import { FormEventHandler, ReactNode } from "react";

export default function FormWrapper({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>; // Made optional
}) {
  return (
    <form 
      onSubmit={onSubmit} 
      className="flex w-full flex-col gap-4 mb-4"
      {...(onSubmit ? {} : { onSubmit: (e) => e.preventDefault() })}
    >
      {children}
    </form>
  );
}