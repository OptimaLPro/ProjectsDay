import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { unassignMyself } from "@/api/projects";

export default function UnassignProjectButton() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: unassignMyself,
    onSuccess: () => {
      queryClient.invalidateQueries(["myProject"]);
      setOpen(false);
    },
    onError: () => {
      alert("Failed to unassign from the project.");
      setOpen(false);
    },
  });

  const handleConfirm = () => {
    mutation.mutate();
  };

  return (
    <>
      <Button variant="destructive" className="gap-2" onClick={() => setOpen(true)}>
        <Edit className="h-4 w-4" />
        Unassign Project
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            You are about to unassign yourself from this project.
            This action cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Unassigning..." : "Yes, Unassign Me"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
