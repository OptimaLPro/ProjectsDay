import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import api from "@/api/api";
import { useState } from "react";
import { useInternships } from "@/hooks/useInternships";
import Loader from "@/components/Loader/Loader";
import ToastMessage from "../ui/ToastMessage";

export default function EditUserDialog({ user, onClose, onSave }) {
  const [preview, setPreview] = useState(user.image || "/images/default.jpg");

  const { data: internships, isLoading: loadingInternships } = useInternships();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email: user.email,
      role: user.role,
      internship: user.internship,
      password: "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      linkedin: user.linkedin || "",
      github: user.github || "",
      website: user.website || "",
      about: user.about || "",
      image: null,
    },
  });

  const imageFile = watch("image");

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("role", values.role);
      formData.append("internship", values.internship);
      formData.append("password", values.password);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("linkedin", values.linkedin);
      formData.append("github", values.github);
      formData.append("website", values.website);
      formData.append("about", values.about);

      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await api.put(`/auth/users/${user._id}`, formData);
      onSave();
      onClose();
      ToastMessage({
        type: "success",
        message: "User updated successfully",
      });
    } catch (err) {
      console.error(err);
      ToastMessage({
        type: "error",
        message: "Failed to update user",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loadingInternships) return <Loader />;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-center">
            <img
              src={preview}
              alt="Profile Preview"
              className="object-cover w-24 h-24 mx-auto rounded-full shadow"
            />
          </div>
          <Input type="file" accept="image/*" onChange={handleImageChange} />

          <Input {...register("email")} placeholder="Email" />
          <Input {...register("role")} placeholder="Role" />

          <Select
            defaultValue={user.internship?.toString()}
            onValueChange={(value) => setValue("internship", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select internship" />
            </SelectTrigger>
            <SelectContent>
              {internships
                ?.filter((i) => i.name !== "All")
                .map((i) => (
                  <SelectItem key={i._id} value={i._id}>
                    {i.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Input {...register("first_name")} placeholder="First Name" />

          <Input {...register("last_name")} placeholder="Last Name" />

          <Input {...register("linkedin")} placeholder="LinkedIn URL" />

          <Input {...register("github")} placeholder="GitHub URL" />

          <Input {...register("website")} placeholder="Website URL" />

          <Textarea
            {...register("about")}
            placeholder="About"
            className="min-h-[100px]"
          />

          <Input
            {...register("password")}
            placeholder="New Password (optional)"
            type="password"
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
