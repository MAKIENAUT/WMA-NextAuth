import {
  MAX_PASS_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/constants/schema-values";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(MAX_PASS_LENGTH, {
    message: "Password should at least have 10 characters",
  })
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character.",
  })
  .trim();

export const signupSchema = z
  .object({
    full_name: z
      .string()
      .min(MIN_USERNAME_LENGTH, "Username must have at least 3 characters")
      .max(MAX_USERNAME_LENGTH, "Username can only have at max 30 characters")
      .trim()
      .toLowerCase(),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .trim()
      .toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SIGNUP_DEFAULT_VALUES: InferredSignupSchemaType = {
  full_name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export type InferredSignupSchemaType = z.infer<typeof signupSchema>;
