import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInstructors } from "@/hooks/useInstructors";
import { useInternships } from "@/hooks/useInternships";
import { addProjectSchema } from "@/schemas/addProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import GenericFormField from "@/components/GenericFormField/GenericFormField";
import { useNavigate } from "react-router";
import api from "@/api/api";

export function UserAddProject() {
  const navigate = useNavigate();
  const {
    data: internshipsData,
    isLoading: internshipsLoading,
    isError: internshipsError,
  } = useInternships();

  const {
    data: instructorsData,
    isLoading: instructorsLoading,
    isError: instructorsError,
  } = useInstructors();

  const form = useForm({
    resolver: zodResolver(addProjectSchema),
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

  const onSubmit = async (values) => {
    const imageFile = values.image[0];

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("internship", values.internship);
    formData.append("description", values.description);
    formData.append("instructor", values.instructor);
    formData.append("year", String(values.year));
    formData.append("image", imageFile);
    formData.append("members", JSON.stringify(values.members));

    try {
      const response = await api.get("/projects/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error creating project");
      }

      const data = await response.json();
      console.log("Project created successfully:", data);
      navigate("/");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  if (internshipsLoading || instructorsLoading) {
    return <Loader />;
  }

  if (internshipsError || instructorsError) {
    return <Error />;
  }

  return (
    <div className="relative mx-auto w-[80%] max-w-[600px] mt-4">
      <h1 className="text-2xl font-bold text-center mb-8">Add New Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <GenericFormField
            name="name"
            control={form.control}
            label="Project Name"
          >
            {(field) => (
              <Input
                {...field}
                placeholder="Enter project name"
                className="bg-white shadow-xl focus:ring-primary"
              />
            )}
          </GenericFormField>
          <GenericFormField
            name="internship"
            control={form.control}
            label="Internship"
          >
            {(field) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-white shadow-xl focus:ring-primary">
                  <SelectValue placeholder="Select internship" />
                </SelectTrigger>
                <SelectContent>
                  {internshipsData?.map((internship) => (
                    <SelectItem key={internship.id} value={internship.name}>
                      {internship.name}
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
              <Textarea
                {...field}
                placeholder="Enter project description"
                className="bg-white shadow-xl focus:ring-primary"
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
                <SelectTrigger className="bg-white shadow-xl focus:ring-primary">
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructorsData?.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.name}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </GenericFormField>
          <GenericFormField name="year" control={form.control} label="Year">
            {(field) => (
              <Input
                {...field}
                type="number"
                placeholder="Enter year"
                disabled
                className="bg-white shadow-xl focus:ring-primary"
              />
            )}
          </GenericFormField>
          <GenericFormField
            name="image"
            control={form.control}
            label="Project Image"
          >
            {(field) => (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files)}
                className="bg-white shadow-xl focus:ring-primary"
              />
            )}
          </GenericFormField>
          <div>
            <h2 className="text-xl font-semibold mb-2">Team Members</h2>
            {fields.map((item, index) => (
              <div key={item.id} className="mb-4 space-y-2 border p-4 rounded">
                <GenericFormField
                  name={`members.${index}.name`}
                  control={form.control}
                  label="Member Name"
                >
                  {(field) => (
                    <Input
                      {...field}
                      placeholder="Enter member name"
                      className="bg-white shadow-xl focus:ring-primary"
                    />
                  )}
                </GenericFormField>
                <GenericFormField
                  name={`members.${index}.email`}
                  control={form.control}
                  label="Member Email"
                >
                  {(field) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter member email"
                      className="bg-white shadow-xl focus:ring-primary"
                    />
                  )}
                </GenericFormField>
                <Button
                  variant="destructive"
                  className="mt-4"
                  onClick={() => remove(index)}
                >
                  <div className="flex items-center gap-2">
                    <Delete />
                    Remove Member
                  </div>
                </Button>
              </div>
            ))}
            <div className="flex justify-end">
              <Button onClick={() => append({ name: "", email: "" })}>
                <div className="flex items-center gap-2">
                  <Plus />
                  Add Member
                </div>
              </Button>
            </div>
            {/* Display error if members array is empty */}
            {form.formState.errors.members && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.members.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center mt-12">
            <Button type="submit" className="text-lg shadow-lg">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UserAddProject;
