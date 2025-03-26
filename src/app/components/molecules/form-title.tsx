import { orelega_one } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function FormTitle({ title }: { title: string }) {
  return (
    <h1
      className={cn(orelega_one.className, "text-3xl sm:text-4xl md:text-5xl")}
    >
      {title}
    </h1>
  );
}
