import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import ToastMessage from "@/components/ui/ToastMessage";

export default function AdminManageYearbook() {
  const queryClient = useQueryClient();
  const [selectedYearbookId, setSelectedYearbookId] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newYear, setNewYear] = useState("");

  const {
    data: yearbooks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["yearbooks"],
    queryFn: () => api.get("/yearbooks").then((res) => res.data),
  });

  const { data: activeYearbook } = useQuery({
    queryKey: ["active-yearbook"],
    queryFn: () => api.get("/yearbooks/active").then((res) => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, year }) =>
      api.put(`/yearbooks/${id}`, { year, active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(["yearbooks"]);
      queryClient.invalidateQueries(["active-yearbook"]);
      ToastMessage({
        type: "success",
        message: "Yearbook updated successfully",
      });
    },
    onError: () => {
      ToastMessage({ type: "error", message: "Failed to update yearbook" });
    },
  });

  const createMutation = useMutation({
    mutationFn: (newYear) =>
      api.post("/yearbooks", { year: Number(newYear), active: false }),
    onSuccess: () => {
      queryClient.invalidateQueries(["yearbooks"]);
      ToastMessage({ type: "success", message: "Yearbook added successfully" });
      setAddDialogOpen(false);
      setNewYear("");
    },
    onError: () => {
      ToastMessage({ type: "error", message: "Failed to add yearbook" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/yearbooks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["yearbooks"]);
      ToastMessage({ type: "success", message: "Yearbook deleted" });
    },
    onError: () => {
      ToastMessage({ type: "error", message: "Failed to delete yearbook" });
    },
  });

  useEffect(() => {
    if (activeYearbook?._id) {
      setSelectedYearbookId(activeYearbook._id);
    }
  }, [activeYearbook]);

  const selectedYearbook = yearbooks?.find((y) => y._id === selectedYearbookId);

  const handleConfirm = () => {
    if (selectedYearbook) {
      updateMutation.mutate({
        id: selectedYearbook._id,
        year: selectedYearbook.year,
      });
      setShowDialog(false);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="relative max-w-md p-6 mx-auto mt-10 bg-white shadow-lg rounded-xl">
      <h1 className="mb-4 text-xl font-semibold text-center">
        Select Active Yearbook
      </h1>

      <div className="flex justify-center">
        <Select
          value={selectedYearbookId}
          onValueChange={(val) => setSelectedYearbookId(val)}
        >
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select Yearbook" />
          </SelectTrigger>
          <SelectContent>
            {yearbooks.map((yb) => (
              <SelectItem key={yb._id} value={yb._id}>
                {yb.year} {yb.active && "(Current)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={() => setShowDialog(true)}
        className="w-full mt-4"
        disabled={
          updateMutation.isPending || selectedYearbookId === activeYearbook?._id
        }
      >
        {updateMutation.isPending ? "Saving..." : "Save as Current Yearbook"}
      </Button>

      <Button onClick={() => setAddDialogOpen(true)} className="w-full mt-2">
        Add New Yearbook
      </Button>

      {selectedYearbookId && (
        <Button
          variant="destructive"
          onClick={() => deleteMutation.mutate(selectedYearbookId)}
          className="w-full mt-2"
        >
          Delete Selected Yearbook
        </Button>
      )}

      {/* Dialogs */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            Changing the active yearbook will update the view for all users.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Yearbook</DialogTitle>
          </DialogHeader>
          <Input
            type="number"
            min={2000}
            max={3000}
            placeholder="Enter year"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
          />

          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const yearNum = Number(newYear);
                if (!yearNum || yearNum < 2000 || yearNum > 3000) {
                  ToastMessage({
                    type: "error",
                    message: "Year must be between 2000 and 3000",
                  });
                  return;
                }
                createMutation.mutate(newYear);
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
