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

interface FileUploadSectionProps {
  control: any;
  resumeFileName: string | null;
  passportFileName: string | null;
  setResumeFileName: (name: string | null) => void;
  setPassportFileName: (name: string | null) => void;
}

export function FileUploadSection({
  control,
  resumeFileName,
  passportFileName,
  setResumeFileName,
  setPassportFileName,
}: FileUploadSectionProps) {
  return (
    <fieldset className="w-full border border-wma-darkTeal rounded-md p-6 mb-6 bg-wma-darkTeal/10">
      <h2
        className={cn(orelega_one.className, "text-xl mb-4 text-wma-darkTeal")}
      >
        3. Required File Upload
      </h2>

      <div className="space-y-4 bg-white p-4 rounded-md">
        <FormField
          control={control}
          name="resume"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem className="w-full">
              <FormLabel>
                Resume (PDF only) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="border-2 border-dashed border-wma-darkTeal rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="resume-upload"
                    onChange={(e) => {
                      onChange(e.target.files);
                      if (e.target.files?.[0]) {
                        setResumeFileName(e.target.files[0].name);
                      }
                    }}
                    {...fieldProps}
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer block"
                  >
                    {resumeFileName ? (
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {resumeFileName}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-sm mb-2">
                          Click/drag & drop your resume here
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="passport"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem className="w-full">
              <FormLabel>
                Passport (PDF only) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="border-2 border-dashed border-wma-darkTeal rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="passport-upload"
                    onChange={(e) => {
                      onChange(e.target.files);
                      if (e.target.files?.[0]) {
                        setPassportFileName(e.target.files[0].name);
                      }
                    }}
                    {...fieldProps}
                  />
                  <label
                    htmlFor="passport-upload"
                    className="cursor-pointer block"
                  >
                    {passportFileName ? (
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {passportFileName}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-sm mb-2">
                          Click/drag & drop your passport here
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </fieldset>
  );
}
