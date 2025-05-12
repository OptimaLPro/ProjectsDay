import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import ToastMessage from "@/components/ui/ToastMessage";
import api from "@/api/api";

export default function AdminDeleteUsersDialog({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAllUsers = async () => {
    setLoading(true);
    try {
      await api.delete("/auth/users");
      ToastMessage({ type: "success", message: "All users deleted" });
      onSuccess();
      setOpen(false);
    } catch (err) {
      ToastMessage({ type: "error", message: "Failed to delete users" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete All Users
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>This will permanently delete <strong>all users from all yearbooks</strong>.</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAllUsers} disabled={loading}>
              {loading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
