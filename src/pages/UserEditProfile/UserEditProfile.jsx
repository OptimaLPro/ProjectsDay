import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/api/api";
import Loader from "@/components/Loader/Loader";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import GenericFormField from "@/components/GenericFormField/GenericFormField";
import { Card } from "@/components/ui/card";

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
  const { user, refreshUser } = useAuth();

  console.log(user);

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
    const formData = new FormData();
    formData.append("first_name", values.first_name || "");
    formData.append("last_name", values.last_name || "");
    formData.append("linkedin", values.linkedin || "");
    formData.append("github", values.github || "");
    formData.append("website", values.website || "");
    formData.append("about", values.about || "");

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    try {
      await api.put(`/auth/users/${user._id}`, formData);
      await refreshUser();
      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="relative mx-auto w-[80%] max-w-[600px] mt-4">
      <h1 className="text-2xl font-bold text-center mb-8">
        Edit Your Profile
      </h1>
      <Card className="p-6 shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border border-white/30 transition-all">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <GenericFormField
              name="first_name"
              control={form.control}
              label="First Name"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="First Name"
                  className="bg-white shadow-xl focus:ring-primary"
                />
              )}
            </GenericFormField>

            <GenericFormField
              name="last_name"
              control={form.control}
              label="Last Name"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="Last Name"
                  className="bg-white shadow-xl focus:ring-primary"
                />
              )}
            </GenericFormField>

            <GenericFormField
              name="linkedin"
              control={form.control}
              label="LinkedIn"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="https://linkedin.com/in/..."
                  className="bg-white shadow-xl focus:ring-primary"
                />
              )}
            </GenericFormField>

            <GenericFormField
              name="github"
              control={form.control}
              label="GitHub"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="https://github.com/..."
                  className="bg-white shadow-xl focus:ring-primary"
                />
              )}
            </GenericFormField>

            <GenericFormField
              name="website"
              control={form.control}
              label="Website"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="https://your-portfolio.com"
                  className="bg-white shadow-xl focus:ring-primary"
                />
              )}
            </GenericFormField>

            <GenericFormField name="about" control={form.control} label="About">
              {(field) => (
                <Textarea
                  {...field}
                  placeholder="Tell us about yourself..."
                  className="bg-white shadow-xl focus:ring-primary"
                />
              )}
            </GenericFormField>

            <GenericFormField
              name="image"
              control={form.control}
              label="Profile Picture"
            >
              {(field) => (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                  className="bg-white shadow-xl focus:ring-primary"
                />
              )}
            </GenericFormField>

            <div className="text-center">
              <Button type="submit" className="text-lg shadow-md my-8">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
