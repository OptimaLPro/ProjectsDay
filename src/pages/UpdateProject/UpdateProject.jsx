import api from "@/api/api";
import Error from "@/components/Error/Error";
import GenericFormField from "@/components/GenericFormField/GenericFormField";
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
import { useMyProject } from "@/hooks/useMyProject";
import { updateProjectSchema } from "@/schemas/updateProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export function UpdateProject() {
  const [didReset, setDidReset] = useState(false);
  const navigate = useNavigate();
  const {
    data: projectData,
    isLoading: projectLoading,
    error: projectError,
  } = useMyProject();

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
    if (
      !didReset &&
      projectData?.project &&
      internshipsData?.length > 0 &&
      instructorsData?.length > 0
    ) {
      const { name, internship, description, instructor, year, members } =
        projectData.project;

      const internshipObj = internshipsData.find((i) => i.name === internship);
      const instructorObj = instructorsData.find((i) => i.name === instructor);

      form.reset({
        name,
        internship: internshipObj?.name ?? "",
        description,
        instructor: instructorObj?.name ?? "",
        year,
        image: undefined,
        members,
      });

      setDidReset(true);
    }
  }, [projectData, internshipsData, instructorsData, didReset, form]);

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

    try {
      const response = await api.put(
        `/projects/${projectData.project._id}`,
        formData
      );
      console.log("Project updated:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  if (projectError || internshipsError || instructorsError) return <Error />;
  if (projectLoading || internshipsLoading || instructorsLoading || !didReset) {
    return <Loader />;
  }

  return (
    <div className="relative mx-auto w-[80%] max-w-[600px] mt-4">
      <h1 className="text-2xl font-bold text-center mb-8">
        Update Your Project
      </h1>
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
                className="bg-white shadow-xl"
              />
            )}
          </GenericFormField>

          <GenericFormField
            name="internship"
            control={form.control}
            label="Internship"
          >
            {(field) => {
              console.log("💥 internship field.value:", field.value);
              return (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white shadow-xl">
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
              );
            }}
          </GenericFormField>

          <GenericFormField
            name="description"
            control={form.control}
            label="Description"
          >
            {(field) => (
              <Textarea
                {...field}
                placeholder="Description"
                className="bg-white shadow-xl"
              />
            )}
          </GenericFormField>

          <GenericFormField
            name="instructor"
            control={form.control}
            label="Instructor"
          >
            {(field) => (
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <SelectTrigger className="bg-white shadow-xl">
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
                disabled
                className="bg-white shadow-xl"
              />
            )}
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
                className="bg-white shadow-xl"
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
                      placeholder="Name"
                      className="bg-white shadow-xl"
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
                      placeholder="Email"
                      className="bg-white shadow-xl"
                    />
                  )}
                </GenericFormField>
                <Button variant="destructive" onClick={() => remove(index)}>
                  <Delete className="w-4 h-4" /> Remove
                </Button>
              </div>
            ))}
            <Button onClick={() => append({ name: "", email: "" })}>
              Add Member
            </Button>
          </div>

          <div className="flex justify-center mt-8">
            <Button type="submit" className="text-lg shadow-lg">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UpdateProject;
