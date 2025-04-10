import api from "@/api/api";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import { useInternships } from "@/hooks/useInternships";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InstructorEditDialog from "./InstructorEditDialog";
import DeleteInstructorDialog from "./DeleteInstructorDialog";

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

  const { data: internshipsData = [], isLoading: loadingInternships } = useInternships();

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
      <h1 className="text-2xl font-bold text-center mb-6">Manage Instructors</h1>

      <Button
        onClick={() => {
          setEditData(null);
          setOpenDialog(true);
        }}
        className="mb-4"
      >
        Add Instructor
      </Button>

      <table className="w-full border text-sm bg-white shadow-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 text-center">Image</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Years</th>
            <th className="border px-2 py-1">Internships</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => {
            const filteredInternships =
              instructor.internships?.filter((i) => i !== "All") || [];
            return (
              <tr key={instructor._id}>
                <td className="border px-2 py-1 text-center">
                  <img
                    src={instructor.image || "/images/default.jpg"}
                    alt={instructor.name}
                    className="w-12 h-12 rounded-full object-cover mx-auto"
                  />
                </td>
                <td className="border px-2 py-1">{instructor.name}</td>
                <td className="border px-2 py-1">
                  {instructor.years?.join(", ") || "—"}
                </td>
                <td className="border px-2 py-1">
                  {filteredInternships.join(", ") || "—"}
                </td>
                <td className="border px-2 py-1 text-center">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditData(instructor);
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
                      setInstructorToDelete(instructor);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
