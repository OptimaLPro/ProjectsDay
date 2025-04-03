import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import { z } from "zod";
import api from "../../api/api.js";
import { useInternships } from "@/hooks/useInternships";
import { useAuth } from "@/context/AuthContext";
import { registerSchema } from "@/schemas/registerSchema.js";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const year = new Date().getFullYear();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "student",
      internship: "",
    },
  });

  const { data: internships = [] } = useInternships();

  const registerMutation = useMutation({
    mutationFn: (values) =>
      api.post("/auth/register", values).then((res) => res.data),
    onSuccess: (data) => {
      login(data.token);
      navigate("/dashboard");
    },
    onError: (error) => {
      const message = error?.response?.data?.error || "Something went wrong.";
      setError(message);
    },
  });

  const onSubmit = (values) => {
    setError("");
    registerMutation.mutate(values);
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white shadow-xl"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter password"
                    className="bg-white shadow-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white shadow-xl">
                      <SelectValue placeholder="Select role"  />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="internship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internship</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white shadow-xl">
                      <SelectValue placeholder="Select internship" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {internships.map((item) => (
                      <SelectItem key={item._id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Year</FormLabel>
            <Input value={year} disabled className="bg-gray-100" />
          </FormItem>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex items-center justify-center mt-8">
            <Button type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
