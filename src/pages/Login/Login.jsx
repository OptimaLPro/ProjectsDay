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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import api from "../../api/api.js";
import { useAuth } from "@/context/AuthContext";
import { loginScheme } from "@/schemas/loginSchema.js";
const DEFAULT_USERNAME = import.meta.env.VITE_DEFAULT_USERNAME;
const DEFAULT_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD;




export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      email: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
    },
  });

  const loginMutation = useMutation({
    mutationFn: (values) =>
      api.post("/auth/login", values).then((res) => res.data),
    onSuccess: (data) => {
      login(data.token);
      navigate("/dashboard");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.error || "Something went wrong, try again.";
      setError(message);
    },
  });

  function onSubmit(values) {
    setError("");
    loginMutation.mutate(values);
  }

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
