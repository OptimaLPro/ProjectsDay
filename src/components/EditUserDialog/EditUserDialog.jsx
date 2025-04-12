import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await api.put(`/auth/users/${user._id}`, formData);
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating user");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-center">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover mx-auto shadow"
            />
          </div>

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
                ?.filter((i) => i.name !== "All") // 🧹 מסיר את ה־"All"
                .map((i) => (
                  <SelectItem key={i._id} value={i._id}>
                    {i.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Input
            {...register("password")}
            placeholder="New Password (optional)"
            type="password"
          />

          <Input type="file" accept="image/*" onChange={handleImageChange} />

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
