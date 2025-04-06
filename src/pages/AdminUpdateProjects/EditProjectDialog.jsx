import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Delete, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema } from "@/schemas/updateProjectSchema";
import { useInternships } from "@/hooks/useInternships";
import { useInstructors } from "@/hooks/useInstructors";
import api from "@/api/api";
import Loader from "@/components/Loader/Loader";
import GenericFormField from "@/components/GenericFormField/GenericFormField";
import { useAuth } from "@/context/AuthContext";

export default function EditProjectDialog({ project, onClose, onSave }) {
  const { user } = useAuth();
  const { data: internships, isLoading: loadingInternships } = useInternships();
  const { data: instructors, isLoading: loadingInstructors } = useInstructors();

  const form = useForm({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: "",
      internship: "",
      description: "",
      instructor: "",
      year: new Date().getFullYear(),
      image: undefined,
      members: [{ name: "", email: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  useEffect(() => {
    if (project && internships && instructors) {
      const { name, internship, description, instructor, year, members } =
        project;

      form.reset({
        name,
        internship,
        description,
        instructor,
        year,
        image: undefined,
        members: members.length ? members : [{ name: "", email: "" }],
      });
    }
  }, [project, internships, instructors, form]);

  const onSubmit = async (values) => {
    const imageFile = values.image?.[0];
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("internship", values.internship);
    formData.append("description", values.description);
    formData.append("instructor", values.instructor);
    formData.append("year", String(values.year));
    formData.append("members", JSON.stringify(values.members));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    formData.append("user", JSON.stringify(user)); // Add user info to formData

    try {
      await api.put(`/projects/${project._id}`, formData);
      onSave();
      onClose();
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  if (loadingInternships || loadingInstructors) return <Loader />;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <GenericFormField
              name="name"
              control={form.control}
              label="Project Name"
            >
              {(field) => <Input {...field} placeholder="Project name" />}
            </GenericFormField>

            <GenericFormField
              name="internship"
              control={form.control}
              label="Internship"
            >
              {(field) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select internship" />
                  </SelectTrigger>
                  <SelectContent>
                    {internships?.map((i) => (
                      <SelectItem key={i._id} value={i.name}>
                        {i.name}
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
              {(field) => <Textarea {...field} placeholder="Description" />}
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
                    {instructors?.map((i) => (
                      <SelectItem key={i._id} value={i.name}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </GenericFormField>

            <GenericFormField name="year" control={form.control} label="Year">
              {(field) => <Input {...field} type="number" disabled />}
            </GenericFormField>

            <GenericFormField
              name="image"
              control={form.control}
              label="Change Image (Optional)"
            >
              {(field) => (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              )}
            </GenericFormField>

            <div>
              <h2 className="text-md font-semibold mb-2">Team Members</h2>
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="mb-4 border p-4 rounded space-y-2"
                >
                  <GenericFormField
                    name={`members.${index}.name`}
                    control={form.control}
                    label="Name"
                  >
                    {(field) => <Input {...field} placeholder="Name" />}
                  </GenericFormField>
                  <GenericFormField
                    name={`members.${index}.email`}
                    control={form.control}
                    label="Email"
                  >
                    {(field) => <Input {...field} placeholder="Email" />}
                  </GenericFormField>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    <Delete className="w-4 h-4" /> Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ name: "", email: "" })}
              >
                Add Member
              </Button>
            </div>

            <div className="flex justify-end mt-4">
              <Button type="submit" className="text-lg shadow-lg">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
