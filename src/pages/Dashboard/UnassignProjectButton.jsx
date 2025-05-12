import { unassignMyself } from "@/api/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ToastMessage from "@/components/ui/ToastMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Unlink } from "lucide-react";
import { useState } from "react";

export default function UnassignProjectButton() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: unassignMyself,
    onSuccess: () => {
      queryClient.invalidateQueries(["myProject"]);
      setOpen(false);
      ToastMessage({
        type: "success",
        message: "You have been unassigned from the project.",
      });
    },
    onError: () => {
      alert("Failed to unassign from the project.");
      setOpen(false);
      ToastMessage({
        type: "error",
        message: "Failed to unassign from the project.",
      });
    },
  });

  const handleConfirm = () => {
    mutation.mutate();
  };

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="p-6 transition-all duration-300 border shadow-xl cursor-pointer hover:scale-105 hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30"
      >
        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
          <Unlink className="w-8 h-8 mb-2" color="red" />
          <CardTitle className="mb-1 text-lg font-semibold">
            Unassign Project
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Leave your current project team.
          </p>
        </CardContent>
      </Card>

      {/* <Button variant="destructive" className="gap-2">
        <Unlink className="w-4 h-4" />
        Unassign Project
      </Button> */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            You are about to unassign yourself from this project. This action
            cannot be undone.
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
