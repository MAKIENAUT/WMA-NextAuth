import { orelega_one } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function FormTitle({ title }: { title: string }) {
  return (
    <h1
      className={cn(orelega_one.className, "text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4")}
    >
      {title}
    </h1>
  );
}