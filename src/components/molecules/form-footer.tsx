import Link from "next/link";
import { Button } from "../atoms/ui/button";

export default function FormFooter({
  variant,
}: {
  variant: "login" | "signup";
}) {
  return (
    <div className="flex w-full flex-col items-center border-t border-wma-darkTeal pt-4 mt-4">
      {variant === "login" ? (
        <p className="text-sm">Don&apos;t have an account yet?</p>
      ) : (
        <p className="text-sm">Already have an account?</p>
      )}
      <Button
        asChild
        variant="link"
        size="none"
        className="font-normal underline text-sm"
      >
        {variant === "login" ? (
          <Link href="/signup">Create an account</Link>
        ) : (
          <Link href="/signin">Sign in</Link>
        )}
      </Button>
    </div>
  );
}