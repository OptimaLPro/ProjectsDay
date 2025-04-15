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
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import ToastMessage from "@/components/ui/ToastMessage";

export default function AdminChangeYearbook() {
  const queryClient = useQueryClient();
  const [selectedYearbookId, setSelectedYearbookId] = useState("");
  const [showDialog, setShowDialog] = useState(false);

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

  const mutation = useMutation({
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
    onError: (error) => {
      console.error("Error updating yearbook:", error);
      ToastMessage({
        type: "error",
        message: "Failed to update yearbook",
      });
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
      mutation.mutate({
        id: selectedYearbook._id,
        year: selectedYearbook.year,
      });
      setShowDialog(false);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl relative">
      <h1 className="text-xl font-semibold mb-4 text-center">
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
        className="mt-4 w-full"
        disabled={
          mutation.isPending || selectedYearbookId === activeYearbook?._id
        }
      >
        {mutation.isPending ? "Saving..." : "Save as Current Yearbook"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            Changing the active yearbook will update the view for all users.
            From now on, the selected yearbook will be shown throughout the
            website.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
