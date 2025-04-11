import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/api/api";
import { useAwards } from "@/hooks/useAwards";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AwardEditDialog from "./AwardEditDialog";
import DeleteAwardDialog from "./DeleteAwardDialog";

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

      <div className="rounded-md bg-white border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {awards.map((award) => (
              <TableRow key={award._id}>
                <TableCell>
                  <img
                    src={award.image}
                    alt={award.name}
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                </TableCell>
                <TableCell>{award.name}</TableCell>
                <TableCell className="max-w-[250px] truncate">
                  {award.description}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditData(award);
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => {
                      setAwardToDelete(award);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
