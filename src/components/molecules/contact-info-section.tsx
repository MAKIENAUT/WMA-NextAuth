import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { orelega_one } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface ContactInfoSectionProps {
  control: any;
}

export function ContactInfoSection({ control }: ContactInfoSectionProps) {
  return (
    <fieldset className="w-full border border-wma-darkTeal rounded-md p-6 mb-6 bg-wma-darkTeal/10">
      <h2
        className={cn(orelega_one.className, "text-xl mb-4 text-wma-darkTeal")}
      >
        2. Contact Information
      </h2>

      <div className="space-y-4 bg-white p-4 rounded-md">
        <FormField
          control={control}
          name="phone_number"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Phone Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Phone Number" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email_address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Email Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Email Address" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </fieldset>
  );
}
