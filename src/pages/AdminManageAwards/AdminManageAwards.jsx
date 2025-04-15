import api from "@/api/api";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import { useAwards } from "@/hooks/useAwards";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AdminAwardTable from "./AdminAwardTable";
import AwardEditDialog from "./AwardEditDialog";
import DeleteAwardDialog from "./DeleteAwardDialog";
import ToastMessage from "@/components/ui/ToastMessage";

export default function AdminManageAwards() {
  const queryClient = useQueryClient();
  const { data: awards = [], isLoading, isError } = useAwards();

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [awardToDelete, setAwardToDelete] = useState(null);

  const mutation = useMutation({
    mutationFn: (formData) => {
      const isEdit = formData.get("_id");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEdit) {
        const id = formData.get("_id");
        return api.put(`/awards/${id}`, formData, config);
      } else {
        return api.post("/awards", formData, config);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["awards"]);
      setOpenDialog(false);
      setEditData(null);
      ToastMessage({
        type: "success",
        message: "Award saved successfully",
      });
    },
    onError: (error) => {
      console.error("Error saving award:", error);
      ToastMessage({
        type: "error",
        message: "Failed to save award",
      });
    },
  });

  const handleSave = (data) => {
    mutation.mutate(data);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/awards/${id}`);
      queryClient.invalidateQueries(["awards"]);
      setDeleteDialogOpen(false);
      setAwardToDelete(null);
    } catch (err) {
      console.error("Failed to delete award", err);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="max-w-4xl mx-auto mt-10 relative">
      <h1 className="text-2xl font-bold text-center mb-6">Manage Awards</h1>

      <Button onClick={() => setOpenDialog(true)} className="mb-4">
        Add Award
      </Button>

      <AdminAwardTable
        awards={awards}
        onEdit={(award) => {
          setEditData(award);
          setOpenDialog(true);
        }}
        onDelete={(award) => {
          setAwardToDelete(award);
          setDeleteDialogOpen(true);
        }}
      />

      <AwardEditDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditData(null);
        }}
        editData={editData}
        onSave={handleSave}
      />

      <DeleteAwardDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        award={awardToDelete}
        onConfirm={handleDelete}
      />
    </div>
  );
}
