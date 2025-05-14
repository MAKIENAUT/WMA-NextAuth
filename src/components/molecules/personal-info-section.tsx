import React from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../atoms/ui/form";
import { Input } from "../atoms/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/ui/select";
import SectionTitle from "../atoms/section-title";
import { countries } from "@/data/countries";
import { professions } from "@/data/professions";
import { Fieldset } from "../atoms/ui/fieldset";
import { Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { orelega_one } from "@/lib/fonts";

interface PersonalInfoSectionProps {
  control: Control<any>;
  showOtherProfession: boolean;
  setShowOtherProfession: (value: boolean) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  control,
  showOtherProfession,
  setShowOtherProfession,
}) => {
  return (
    <Fieldset className="border border-wma-darkTeal rounded-md p-6 mb-6 bg-wma-darkTeal/10">
      <h2
        className={cn(orelega_one.className, "text-xl mb-4 text-wma-darkTeal")}
      >
        1. Personal Information
      </h2>

      <div className="space-y-4 bg-white p-4 rounded-md">
        {/* Name Fields */}
        <div className="space-y-2">
          <label className="block">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Fields */}
        <div className="space-y-2">
          <label className="block">
            Full Address <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-4">
            <FormField
              control={control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="full_address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="# Street, City, State/Province"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Profession Fields */}
        <div className="space-y-2">
          <label className="block">
            Profession <span className="text-red-500">*</span>
          </label>
          <FormField
            control={control}
            name="profession"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherProfession(value === "Other");
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((profession) => (
                        <SelectItem key={profession} value={profession}>
                          {profession}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showOtherProfession && (
            <FormField
              control={control}
              name="other_profession"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="If Other: Specify profession"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </Fieldset>
  );
};

export default PersonalInfoSection;
