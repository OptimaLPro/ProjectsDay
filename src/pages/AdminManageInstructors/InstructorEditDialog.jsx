import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_YEARS = [2024, 2025, 2026];

export default function InstructorEditDialog({
  open,
  onClose,
  onSave,
  instructor,
  years,
  internships,
  setInstructor,
  selectedYears,
  setSelectedYears,
  selectedInternships,
  setSelectedInternships,
  imageFile,
  setImageFile,
  mutation,
}) {
  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const toggleInternship = (id) => {
    setSelectedInternships((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClose = () => {
    onClose();
    setInstructor(null);
    setSelectedYears([]);
    setSelectedInternships([]);
    setImageFile(null);
  };

  const preview = imageFile
    ? URL.createObjectURL(imageFile)
    : instructor?.image || "/images/default.jpg";

  const filteredInternships = internships.filter((i) => i.name !== "All");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Instructor</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSave} className="flex flex-col gap-4">
          <Input
            name="name"
            placeholder="Instructor name"
            defaultValue={instructor?.name || ""}
            required
          />

          <div className="text-center">
            <img
              src={preview}
              alt="Instructor"
              className="w-24 h-24 rounded-full object-cover mx-auto shadow"
            />
          </div>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <Textarea
            name="description"
            placeholder="Instructor description"
            defaultValue={instructor?.description || ""}
          />

          <div>
            <p className="font-semibold mb-1">Years</p>
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
          </div>

          <div>
            <p className="font-semibold mb-1">Internships</p>
            <div className="flex flex-col gap-2">
              {filteredInternships.map((intern) => (
                <label key={intern._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedInternships.includes(intern._id)}
                    onCheckedChange={() => toggleInternship(intern._id)}
                  />
                  {intern.name}
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
