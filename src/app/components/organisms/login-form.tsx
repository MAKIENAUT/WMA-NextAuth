"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InferredLoginSchemaType,
  LOGIN_DEFAULT_VALUES,
  loginSchema,
} from "@/types/login-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../atoms/ui/form";
import { Input } from "../atoms/ui/input";
import { Button } from "../atoms/ui/button";
import FormFooter from "../molecules/form-footer";
import FormContent from "../molecules/form-content";
import FormTitle from "../molecules/form-title";
import InputGroup from "../molecules/input-group";
import FormWrapper from "../molecules/form-wrapper";
import { useAuthContext } from "@/features/auth/components/auth-provider";

export default function LoginForm() {
  const { loginMutation } = useAuthContext();

  const form = useForm<InferredLoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
    mode: "onBlur",
  });

  function onSubmit(values: InferredLoginSchemaType) {
    loginMutation.mutate(values);
  }

  return (
    <>
      <FormContent>
        <FormTitle title="Login" />
        <Form {...form}>
          <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
            <InputGroup>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </InputGroup>
            <Button
              type="submit"
              variant="secondary"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in" : "Log in"}
            </Button>
          </FormWrapper>
        </Form>
      </FormContent>
      <FormFooter variant="login" />
    </>
  );
}
