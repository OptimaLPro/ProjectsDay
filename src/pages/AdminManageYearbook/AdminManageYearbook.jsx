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
import { useYearbooks } from "@/hooks/useYearbooks";

export default function AdminManageYearbook() {
  const queryClient = useQueryClient();
  const [excludeDialogOpen, setExcludeDialogOpen] = useState(false);
  const [selectedYearbookId, setSelectedYearbookId] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [excluded, setExcluded] = useState([]);

  const { data: yearbooks, isLoading, isError } = useYearbooks();
  const {
    data: activeYearbook,
    isLoadingYearbooks,
    isErrorYearbooks,
  } = useYearbooks();

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

  const selectedYearbook = yearbooks?.find((y) => y._id === selectedYearbookId);

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

  useEffect(() => {
    if (selectedYearbook?.excludedUsers) {
      setExcluded(selectedYearbook.excludedUsers);
    }
  }, [selectedYearbook]);

  useEffect(() => {
    api
      .get("/auth/users")
      .then((res) => setAllUsers(res.data))
      .catch(() =>
        ToastMessage({ type: "error", message: "Failed to fetch users" })
      );
  }, []);

  const handleConfirm = () => {
    if (selectedYearbook) {
      updateMutation.mutate({
        id: selectedYearbook._id,
        year: selectedYearbook.year,
      });
      setShowDialog(false);
    }
  };

  const handleSaveExcluded = () => {
    api
      .put(`/yearbooks/${selectedYearbookId}`, {
        excludedUsers: excluded,
      })
      .then(() => {
        queryClient.invalidateQueries(["yearbooks"]);
        setExcludeDialogOpen(false);
        ToastMessage({ type: "success", message: "Excluded users updated" });
      })
      .catch(() =>
        ToastMessage({
          type: "error",
          message: "Failed to update excluded users",
        })
      );
  };

  if (isLoading || isLoadingYearbooks) return <Loader />;
  if (isError || isErrorYearbooks) return <Error />;

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

      {selectedYearbookId && (
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() =>
            api
              .put(`/yearbooks/${selectedYearbookId}`, {
                userBlock: !selectedYearbook?.userBlock,
              })
              .then(() => {
                queryClient.invalidateQueries(["yearbooks"]);
                ToastMessage({
                  type: "success",
                  message: selectedYearbook?.userBlock
                    ? "Users unblocked"
                    : "Users blocked",
                });
              })
              .catch(() => {
                ToastMessage({
                  type: "error",
                  message: "Failed to update user block status",
                });
              })
          }
        >
          {selectedYearbook?.userBlock
            ? "Unblock All Users"
            : "Block All Users"}
        </Button>
      )}

      {selectedYearbook?.userBlock && (
        <Button
          className="w-full mt-2"
          onClick={() => setExcludeDialogOpen(true)}
        >
          Manage Excluded Users
        </Button>
      )}

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

      <Dialog open={excludeDialogOpen} onOpenChange={setExcludeDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Exclude Users from Block</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-3"
          />

          <div className="space-y-2 overflow-y-auto max-h-64">
            {allUsers
              .filter((u) =>
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between px-2 py-1 border rounded"
                >
                  <div className="text-sm">{user.email}</div>
                  <Button
                    size="sm"
                    variant={
                      excluded.includes(user._id) ? "destructive" : "outline"
                    }
                    onClick={() =>
                      setExcluded((prev) =>
                        prev.includes(user._id)
                          ? prev.filter((id) => id !== user._id)
                          : [...prev, user._id]
                      )
                    }
                  >
                    {excluded.includes(user._id) ? "Remove" : "Add"}
                  </Button>
                </div>
              ))}
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="secondary"
              onClick={() => setExcludeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveExcluded}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
