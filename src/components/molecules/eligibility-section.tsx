import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/atoms/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/ui/radio-group";
import { Label } from "@/components/atoms/ui/label";
import { orelega_one } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface EligibilitySectionProps {
  control: any;
}

export function EligibilitySection({ control }: EligibilitySectionProps) {
  return (
    <fieldset className="w-full border border-wma-darkTeal rounded-md p-6 mb-6 bg-wma-darkTeal/10">
      <h2
        className={cn(orelega_one.className, "text-xl mb-4 text-wma-darkTeal")}
      >
        4. Program Category Requirements
      </h2>

      <div className="space-y-4 bg-white p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <img
              src="/photos/category.jpg"
              alt="Category Requirements"
              className="w-full h-auto cursor-zoom-in"
            />
          </div>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <img
              src="/photos/category2.PNG"
              alt="Category Requirements"
              className="w-full h-auto cursor-zoom-in"
            />
          </div>
        </div>

        <FormField
          control={control}
          name="confirm_eligibility"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Do you meet the eligibility requirement for the specific
                program? <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </fieldset>
  );
}
