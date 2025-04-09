import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";

const DEFAULT_YEARS = [2024, 2025, 2026];

export default function AdminManageInternships() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedYears, setSelectedYears] = useState([]);

  const {
    data: internships,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["internships-all"],
    queryFn: () => api.get("/internships").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      if (formData._id) {
        return api.put(`/internships/${formData._id}`, formData);
      } else {
        return api.post("/internships", formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["internships-all"]);
      setOpenDialog(false);
      setEditData(null);
      setSelectedYears([]);
    },
  });

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.name.value,
      years: selectedYears,
    };
    if (editData?._id) formData._id = editData._id;
    mutation.mutate(formData);
  };

  useEffect(() => {
    if (editData?.years) {
      setSelectedYears(editData.years);
    } else {
      setSelectedYears([]);
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

      <table className="w-full border text-sm bg-white shadow-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Years</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {internships
            .filter((intern) => intern.name !== "All")
            .map((intern) => (
              <tr key={intern._id}>
                <td className="border px-2 py-1">{intern.name}</td>
                <td className="border px-2 py-1">
                  {intern.years?.join(", ") || "—"}
                </td>
                <td className="border px-2 py-1 text-center">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditData(intern);
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) {
            setEditData(null);
            setSelectedYears([]);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editData ? "Edit Internship" : "Add Internship"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              name="name"
              placeholder="Internship name"
              defaultValue={editData?.name || ""}
              required
            />

            <div className="flex flex-col gap-2">
              {DEFAULT_YEARS.map((year) => (
                <label key={year} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedYears.includes(year)}
                    onCheckedChange={() => toggleYear(year)}
                  />
                  {year}
                </label>
              ))}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
