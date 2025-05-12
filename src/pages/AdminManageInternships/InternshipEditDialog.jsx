import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useInstructors } from "@/hooks/useInstructors";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import Loader from "@/components/Loader/Loader";
import GenericFormField from "@/components/GenericFormField/GenericFormField";
import { useEffect } from "react";
import { useYearbooks } from "@/hooks/useYearbooks";
import Error from "@/components/Error/Error";

export default function InternshipEditDialog({
  open,
  onClose,
  onSave,
  editData,
  years,
  selectedYears,
  setSelectedYears,
  mutation,
}) {
  const { data: instructors, isLoading: loadingInstructors } = useInstructors();

  const {
    data: yearbooks = [],
    isLoadingYearbooks,
    isErrorYearbooks,
  } = useYearbooks();

  const form = useForm({
    defaultValues: {
      name: "",
      instructor: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name || "",
        instructor: editData.instructor?._id || editData.instructor || "",
        description: editData.description || "",
      });
      setSelectedYears(editData.years || []);
    } else {
      form.reset({ name: "", instructor: "", description: "" });
      setSelectedYears([]);
    }
  }, [editData, form, setSelectedYears]);

  const toggleYear = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleClose = () => {
    onClose();
    setSelectedYears([]);
  };

  if (loadingInstructors || isLoadingYearbooks) return <Loader />;
  if (isErrorYearbooks) return <Error />;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Internship" : "Add Internship"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              const data = {
                ...values,
                years: selectedYears,
              };
              onSave({ ...data, _id: editData?._id });
            })}
            className="flex flex-col gap-4"
          >
            <GenericFormField
              name="name"
              control={form.control}
              label="Internship Name"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="Enter internship name"
                  required
                />
              )}
            </GenericFormField>

            <GenericFormField
              name="instructor"
              control={form.control}
              label="Instructor"
            >
              {(field) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((inst) => (
                      <SelectItem key={inst._id} value={inst._id}>
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </GenericFormField>

            <GenericFormField
              name="description"
              control={form.control}
              label="Description"
            >
              {(field) => (
                <Textarea {...field} placeholder="Enter description" required />
              )}
            </GenericFormField>

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

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
