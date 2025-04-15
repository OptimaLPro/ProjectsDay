import api from "@/api/api";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import { useInternships } from "@/hooks/useInternships";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AdminInstructorTable from "./AdminInstructorTable";
import DeleteInstructorDialog from "./DeleteInstructorDialog";
import InstructorEditDialog from "./InstructorEditDialog";
import ToastMessage from "@/components/ui/ToastMessage";

const DEFAULT_YEARS = [2024, 2025, 2026];

export default function AdminManageInstructors() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedInternships, setSelectedInternships] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState(null);

  const { data: internshipsData = [], isLoading: loadingInternships } =
    useInternships();

  const {
    data: instructors,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["instructors-all"],
    queryFn: () => api.get("/instructors").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      if (formData.has("_id")) {
        return api.put(`/instructors/${formData.get("_id")}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        return api.post("/instructors", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["instructors-all"]);
      setOpenDialog(false);
      setEditData(null);
      setSelectedYears([]);
      setSelectedInternships([]);
      setImageFile(null);
      ToastMessage({
        type: "success",
        message: "Instructor saved successfully",
      });
    },
    onError: (error) => {
      console.error("Error saving instructor", error);
      ToastMessage({
        type: "error",
        message: "Failed to save instructor",
      });
    },
  });

  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    if (editData?._id) formData.append("_id", editData._id);
    formData.append("name", form.name.value);
    formData.append("description", form.description.value);
    formData.append("years", JSON.stringify(selectedYears));
    formData.append("internships", JSON.stringify(selectedInternships));

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (editData?.image) {
      formData.append("image", editData.image);
    }

    mutation.mutate(formData);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/instructors/${id}`);
      queryClient.invalidateQueries(["instructors-all"]);
    } catch (err) {
      console.error("Failed to delete instructor", err);
    }
  };

  useEffect(() => {
    if (editData?.years) setSelectedYears(editData.years);
    else setSelectedYears([]);

    if (editData?.internships) setSelectedInternships(editData.internships);
    else setSelectedInternships([]);

    setImageFile(null);
  }, [editData]);

  if (isLoading || loadingInternships) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="max-w-5xl mx-auto mt-10 relative">
      <h1 className="text-2xl font-bold text-center mb-6">
        Manage Instructors
      </h1>

      <Button
        onClick={() => {
          setEditData(null);
          setOpenDialog(true);
        }}
        className="mb-4"
      >
        Add Instructor
      </Button>

      <AdminInstructorTable
        instructors={instructors}
        onEdit={(instructor) => {
          setEditData(instructor);
          setOpenDialog(true);
        }}
        onDelete={(instructor) => {
          setInstructorToDelete(instructor);
          setDeleteDialogOpen(true);
        }}
      />

      <InstructorEditDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        instructor={editData}
        years={DEFAULT_YEARS}
        internships={internshipsData}
        setInstructor={setEditData}
        selectedYears={selectedYears}
        setSelectedYears={setSelectedYears}
        selectedInternships={selectedInternships}
        setSelectedInternships={setSelectedInternships}
        imageFile={imageFile}
        setImageFile={setImageFile}
        mutation={mutation}
      />

      <DeleteInstructorDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        instructor={instructorToDelete}
        onConfirm={handleDelete}
      />
    </div>
  );
}
