import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/api/api";

export default function DeleteUserDialog({ user, onClose, onDelete }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/auth/users/${user._id}`);
      onDelete();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete <strong>{user.email}</strong>?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
