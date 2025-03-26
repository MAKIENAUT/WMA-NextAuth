import { MIN_PASS_LENGTH } from "@/constants/schema-values";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(MIN_PASS_LENGTH, { message: "Please enter a valid password" })
    .trim(),
});

export const LOGIN_DEFAULT_VALUES: InferredLoginSchemaType = {
  email: "",
  password: "",
};

export type InferredLoginSchemaType = z.infer<typeof loginSchema>;
