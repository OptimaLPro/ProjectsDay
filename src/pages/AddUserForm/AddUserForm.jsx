// 📁 src/components/Admin/AddUserForm.jsx
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
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useMutation } from "@tanstack/react-query";
  import { useState } from "react";
  import { registerSchema } from "@/schemas/registerSchema";
  import { useInternships } from "@/hooks/useInternships";
  import api from "@/api/api";
  
  export default function AddUserForm({ onSuccess }) {
    const [error, setError] = useState("");
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
      onSuccess: () => {
        onSuccess?.();
        form.reset();
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
      <div className="max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
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
                    <Input type="password" placeholder="Enter password" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
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
                      <SelectTrigger>
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
  
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  
            <div className="text-center">
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Adding..." : "Add User"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }
  