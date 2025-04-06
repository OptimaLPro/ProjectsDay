import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import api from "@/api/api";

export default function EditUserDialog({ user, onClose, onSave }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: user.email,
      role: user.role,
      internship: user.internship,
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await api.put(`/auth/users/${user._id}`, values);
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating user");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("email")} placeholder="Email" />
          <Input {...register("role")} placeholder="Role" />
          <Input {...register("internship")} placeholder="Internship" />
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
