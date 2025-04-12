import api from "@/api/api";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import { useInstructors } from "@/hooks/useInstructors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AdminInternshipsTable from "./AdminInternshipsTable";
import DeleteInternshipDialog from "./DeleteInternshipDialog";
import InternshipEditDialog from "./InternshipEditDialog";

const DEFAULT_YEARS = [2024, 2025, 2026];

export default function AdminManageInternships() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState(null);
  const { data: instructorsData = [], isLoading: loadingInstructors } =
    useInstructors();

  const {
    data: internships,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["internships-all"],
    queryFn: () => api.get("/internships").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, data }) => {
      if (id) {
        return api.put(`/internships/${id}`, data);
      } else {
        return api.post("/internships", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["internships-all"]);
      setOpenDialog(false);
      setEditData(null);
      setSelectedYears([]);
      setSelectedInstructor("");
    },
  });

  const handleSave = (data) => {
    if (data._id) {
      mutation.mutate({ id: data._id, data });
    } else {
      mutation.mutate({ data });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/internships/${id}`);
      queryClient.invalidateQueries(["internships-all"]);
    } catch (err) {
      console.error("Failed to delete internship", err);
    }
  };

  useEffect(() => {
    if (editData?.years) {
      setSelectedYears(editData.years);
    } else {
      setSelectedYears([]);
    }

    if (editData?.instructor) {
      setSelectedInstructor(editData.instructor);
    } else {
      setSelectedInstructor("");
    }
  }, [editData]);

  if (isLoading || loadingInstructors) return <Loader />;

  if (isError) return <Error />;

  return (
    <div className="max-w-3xl mx-auto mt-10 relative">
      <h1 className="text-2xl font-bold text-center mb-6">
        Manage Internships
      </h1>

      <Button onClick={() => setOpenDialog(true)} className="mb-4">
        Add Internship
      </Button>

      <AdminInternshipsTable
        internships={internships}
        onEdit={(intern) => {
          setEditData(intern);
          setOpenDialog(true);
        }}
        instructors={instructorsData}
        onDelete={(intern) => {
          setInternshipToDelete(intern);
          setDeleteDialogOpen(true);
        }}
      />

      <InternshipEditDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        editData={editData}
        years={DEFAULT_YEARS}
        selectedYears={selectedYears}
        setSelectedYears={setSelectedYears}
        selectedInstructor={selectedInstructor}
        setSelectedInstructor={setSelectedInstructor}
        instructors={instructorsData} // 👈 חדש
        mutation={mutation}
      />

      <DeleteInternshipDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        instructor={internshipToDelete}
        onConfirm={handleDelete}
        entityName="Internship"
      />
    </div>
  );
}
