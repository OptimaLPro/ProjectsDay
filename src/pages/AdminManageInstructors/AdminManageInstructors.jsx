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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";

const DEFAULT_YEARS = [2024, 2025, 2026];

export default function AdminManageInstructors() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedYears, setSelectedYears] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const { data: instructors, isLoading, isError } = useQuery({
    queryKey: ["instructors-all"],
    queryFn: () => api.get("/instructors").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return api.put(`/instructors/${formData.get("_id")}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["instructors-all"]);
      setOpenDialog(false);
      setEditData(null);
      setSelectedYears([]);
      setImageFile(null);
    },
  });

  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append("_id", editData._id);
    formData.append("name", form.name.value);
    formData.append("description", form.description.value);
    formData.append("years", JSON.stringify(selectedYears));

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", editData.image); // keep original URL
    }

    mutation.mutate(formData);
  };

  useEffect(() => {
    if (editData?.years) {
      setSelectedYears(editData.years);
    } else {
      setSelectedYears([]);
    }
    setImageFile(null); // reset file on new open
  }, [editData]);

  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year)
        ? prev.filter((y) => y !== year)
        : [...prev, year]
    );
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="max-w-5xl mx-auto mt-10 relative">
      <h1 className="text-2xl font-bold text-center mb-6">Manage Instructors</h1>

      <table className="w-full border text-sm bg-white shadow-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Years</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor._id}>
              <td className="border px-2 py-1">{instructor.name}</td>
              <td className="border px-2 py-1">
                {instructor.years?.join(", ") || "—"}
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
            setImageFile(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Instructor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              name="name"
              placeholder="Instructor name"
              defaultValue={editData?.name || ""}
              required
            />

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <Textarea
              name="description"
              placeholder="Instructor description"
              defaultValue={editData?.description || ""}
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
