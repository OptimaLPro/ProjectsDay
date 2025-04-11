import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  export default function DeleteAwardDialog({ open, onClose, award, onConfirm }) {
    if (!award) return null;
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Award</DialogTitle>
          </DialogHeader>
          <p className="text-sm mb-4">
            Are you sure you want to delete <strong>{award.name}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => onConfirm(award._id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  