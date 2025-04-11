import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import InternshipEditDialog from "./InternshipEditDialog";
import DeleteInternshipDialog from "./DeleteInternshipDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DEFAULT_YEARS = [2024, 2025, 2026];

export default function AdminManageInternships() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState(null);

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

  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="max-w-3xl mx-auto mt-10 relative">
      <h1 className="text-2xl font-bold text-center mb-6">
        Manage Internships
      </h1>

      <Button onClick={() => setOpenDialog(true)} className="mb-4">
        Add Internship
      </Button>

      <div className="rounded-md bg-white border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Years</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {internships
              .filter((intern) => intern.name !== "All")
              .map((intern) => (
                <TableRow key={intern._id}>
                  <TableCell>{intern.name}</TableCell>
                  <TableCell>{intern.instructor}</TableCell>
                  <TableCell>{intern.years?.join(", ") || "—"}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditData(intern);
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
                        setInternshipToDelete(intern);
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
