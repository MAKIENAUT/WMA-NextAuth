import Link from "next/link";
import { Button } from "../atoms/ui/button";

export default function FormFooter({
  variant,
}: {
  variant: "login" | "signup";
}) {
  return (
    <div className="flex w-full flex-col items-center border-t border-wma-darkTeal pt-6">
      {variant === "login" ? (
        <p>Don&apos;t have an account yet?</p>
      ) : (
        <p>Already have an account?</p>
      )}
      <Button
        asChild
        variant="link"
        size="none"
        className="font-normal underline"
      >
        {variant === "login" ? (
          <Link href="/signup">Create an account</Link>
        ) : (
          <Link href="/login">Sign in</Link>
        )}
      </Button>
    </div>
  );
}
