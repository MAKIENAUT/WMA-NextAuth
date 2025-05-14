import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/atoms/ui/form";
import { Checkbox } from "@/components/atoms/ui/checkbox";
import Link from "next/link";
import { orelega_one } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface PrivacyPolicySectionProps {
  control: any;
}

export function PrivacyPolicySection({ control }: PrivacyPolicySectionProps) {
  return (
    <fieldset className="w-full border border-wma-darkTeal rounded-md p-6 mb-6 bg-wma-darkTeal/10">
      <h2
        className={cn(orelega_one.className, "text-xl mb-4 text-wma-darkTeal")}
      >
        5. Privacy Policy
      </h2>

      <div className="space-y-4 bg-white p-4 rounded-md">
        <p className="text-sm text-gray-700 mb-4">
          Read the Privacy Policy and give permission for West Migration Agency
          LLC to share my information and discuss my candidacy with any US
          Sponsors as part of the visa process.
        </p>

        <Link
          href="/privacy-policy"
          className="text-wma-darkTeal hover:text-wma-gold underline block mb-4"
        >
          Click & Read!
        </Link>

        <FormField
          control={control}
          name="terms_and_condition"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I agree to the terms and conditions</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </fieldset>
  );
}
