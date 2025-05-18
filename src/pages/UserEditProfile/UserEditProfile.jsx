import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/api/api";
import Loader from "@/components/Loader/Loader";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading"; // ✅
import { useAuth } from "@/context/AuthContext";
import GenericFormField from "@/components/GenericFormField/GenericFormField";
import { Card } from "@/components/ui/card";
import ToastMessage from "@/components/ui/ToastMessage";
import { useNavigate } from "react-router";
import { compressImage } from "@/lib/compressImage"; // ✅

const schema = z.object({
  first_name: z.string().max(30).optional(),
  last_name: z.string().max(30).optional(),
  linkedin: z.string().url().or(z.literal("")).optional(),
  github: z.string().url().or(z.literal("")).optional(),
  website: z.string().url().or(z.literal("")).optional(),
  about: z.string().max(500).optional(),
  image: z
    .preprocess(
      (val) => (val instanceof FileList ? val : undefined),
      z
        .instanceof(FileList)
        .refine(
          (files) => files.length === 0 || files[0]?.size <= 10 * 1024 * 1024,
          {
            message: "Image must be under 10MB.",
          }
        )
    )
    .optional(),
});

export default function UserEditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      linkedin: "",
      github: "",
      website: "",
      about: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        website: user.website || "",
        about: user.about || "",
        image: undefined,
      });
    }
  }, [user]);

  const onSubmit = async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("first_name", values.first_name || "");
    formData.append("last_name", values.last_name || "");
    formData.append("linkedin", values.linkedin || "");
    formData.append("github", values.github || "");
    formData.append("website", values.website || "");
    formData.append("about", values.about || "");

    if (values.image && values.image.length > 0) {
      const originalFile = values.image[0];
      const compressed = await compressImage(originalFile, 1024, 0.8); // ✅
      formData.append("image", compressed);
    }

    try {
      const res = await api.put(`/auth/users/${user._id}`, formData);
      const { token, user: updatedUser } = res.data;

      localStorage.setItem("token", token);
      updateUser(updatedUser);
      navigate(-1);
      ToastMessage({
        message: "Profile updated successfully.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      ToastMessage({
        message: "Failed to update profile.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false); // ✅
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="relative mx-auto w-[80%] max-w-[600px] mt-4">
      <h1 className="mb-8 text-2xl font-bold text-center">Edit Your Profile</h1>
      <Card className="p-6 transition-all border shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <GenericFormField name="first_name" control={form.control} label="First Name">
              {(field) => (
                <Input {...field} placeholder="First Name" className="bg-white shadow-xl" />
              )}
            </GenericFormField>

            <GenericFormField name="last_name" control={form.control} label="Last Name">
              {(field) => (
                <Input {...field} placeholder="Last Name" className="bg-white shadow-xl" />
              )}
            </GenericFormField>

            <GenericFormField name="linkedin" control={form.control} label="LinkedIn">
              {(field) => (
                <Input {...field} placeholder="https://linkedin.com/in/..." className="bg-white shadow-xl" />
              )}
            </GenericFormField>

            <GenericFormField name="github" control={form.control} label="GitHub">
              {(field) => (
                <Input {...field} placeholder="https://github.com/..." className="bg-white shadow-xl" />
              )}
            </GenericFormField>

            <GenericFormField name="website" control={form.control} label="Website">
              {(field) => (
                <Input {...field} placeholder="https://your-portfolio.com" className="bg-white shadow-xl" />
              )}
            </GenericFormField>

            <GenericFormField name="about" control={form.control} label="About">
              {(field) => (
                <Textarea {...field} placeholder="Tell us about yourself..." className="bg-white shadow-xl" />
              )}
            </GenericFormField>

            <GenericFormField name="image" control={form.control} label="Profile Picture">
              {(field) => (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                  className="bg-white shadow-xl"
                />
              )}
            </GenericFormField>

            <div className="text-center">
              {isSubmitting ? (
                <ButtonLoading />
              ) : (
                <Button type="submit" className="my-8 text-lg shadow-md">
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
