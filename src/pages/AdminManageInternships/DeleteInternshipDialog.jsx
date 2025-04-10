import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  export default function DeleteInternshipDialog({
    open,
    onClose,
    instructor, // או internship
    onConfirm,
    entityName = "Instructor", // אפשר גם "Internship"
  }) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {entityName}</DialogTitle>
          </DialogHeader>
  
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <strong>{instructor?.name}</strong>?
          </p>
  
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm(instructor._id);
                onClose();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  