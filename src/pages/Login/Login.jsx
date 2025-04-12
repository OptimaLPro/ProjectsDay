import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/hooks/useAuth.js";
import { loginScheme } from "@/schemas/loginSchema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
const DEFAULT_USERNAME = import.meta.env.VITE_DEFAULT_USERNAME;
const DEFAULT_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      email: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
    },
  });

  const loginMutation = useLogin((token) => {
    login(token);
    navigate("/dashboard");
  });

  const onSubmit = (values) => {
    setError("");
    loginMutation.mutate(values, {
      onError: (err) => {
        const message =
          err?.response?.data?.error || "Something went wrong, try again.";
        setError(message);
      },
    });
  };

  return (
    <div className="relative mx-auto w-[80%] max-w-[300px] mt-16">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="bg-white shadow-xl focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="bg-white shadow-xl focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}

          <div className="flex items-center justify-center mt-12">
            <Button
              type="submit"
              className="text-lg shadow-lg"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
