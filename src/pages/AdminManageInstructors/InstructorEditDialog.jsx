import Error from "@/components/Error/Error";
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
import { useYearbooks } from "@/hooks/useYearbooks";

export default function InstructorEditDialog({
  open,
  onClose,
  onSave,
  instructor,
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

  const {
    data: yearbooks = [],
    isLoadingYearbooks,
    isErrorYearbooks,
  } = useYearbooks();

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

  if (isLoadingYearbooks) return <Loader />;
  if (isErrorYearbooks) return <Error />;

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
              className="object-cover w-24 h-24 mx-auto rounded-full shadow"
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
            <p className="mb-1 font-semibold">Years</p>
            <div className="flex flex-col gap-2">
              {yearbooks.map((yb) => (
                <label key={yb._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedYears.includes(yb.year)}
                    onCheckedChange={() => toggleYear(yb.year)}
                  />
                  {yb.year}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 font-semibold">Internships</p>
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
