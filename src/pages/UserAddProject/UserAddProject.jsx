import api from "@/api/api";
import Error from "@/components/Error/Error";
import GenericFormField from "@/components/GenericFormField/GenericFormField";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EmailAutocomplete from "@/components/ui/EmailAutocomplete";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ToastMessage from "@/components/ui/ToastMessage";
import { useAuth } from "@/context/AuthContext";
import { useInstructors } from "@/hooks/useInstructors";
import { useInternships } from "@/hooks/useInternships";
import { useUserEmails } from "@/hooks/useUserEmails";
import { addProjectSchema } from "@/schemas/addProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Info, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export function UserAddProject() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const { data: userList = [] } = useUserEmails();

  const form = useForm({
    resolver: zodResolver(addProjectSchema),
    defaultValues: {
      name: "",
      internship: user?.internship || "",
      description: "",
      short_description: "",
      youtube: "",
      gallery: [],
      newGallery: undefined,
      instructor: "",
      year: new Date().getFullYear(),
      image: undefined,
      members: [{ email: user?.email || "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const onSubmit = async (values) => {
    const imageFile = values.image?.[0];
    const newGalleryFiles = values.newGallery || [];

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("internship", values.internship);
    formData.append("description", values.description);
    formData.append("short_description", values.short_description);
    formData.append("youtube", values.youtube);
    formData.append("instructor", values.instructor);
    formData.append("year", String(values.year));
    formData.append("members", JSON.stringify(values.members));
    formData.append("gallery", JSON.stringify(values.gallery || []));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    Array.from(newGalleryFiles).forEach((file) => {
      formData.append("newGalleryFiles", file);
    });

    try {
      await api.post("/projects/create", formData);
      navigate("/dashboard");
      ToastMessage({
        type: "success",
        message: "Project created successfully.",
      });
    } catch (error) {
      console.error("Failed to create project:", error);
      ToastMessage({ type: "error", message: "Failed to create project." });
    }
  };

  if (internshipsLoading || instructorsLoading) return <Loader />;
  if (internshipsError || instructorsError) return <Error />;

  const selectedInternship =
    internshipsData?.find((i) => i._id === user?.internship) || null;

  return (
    <div className="relative mx-auto w-[90%] lg:w-[80%] max-w-[600px] mt-4">
      <Card className="p-6 shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border border-white/30 transition-all">
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
                  className="bg-white shadow-xl"
                />
              )}
            </GenericFormField>

            <GenericFormField
              name="internship"
              control={form.control}
              label="Internship"
            >
              {(field) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled
                >
                  <SelectTrigger className="bg-white shadow-xl">
                    <SelectValue placeholder="Select internship">
                      {selectedInternship?.name || "Select internship"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {internshipsData?.map((internship) => (
                      <SelectItem key={internship._id} value={internship._id}>
                        {internship.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </GenericFormField>

            <GenericFormField
              name="short_description"
              control={form.control}
              label={
                <div className="flex items-center gap-2">
                  Short Description
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="max-w-xs text-sm"
                      side="top"
                      align="start"
                      collisionPadding={10}
                    >
                      Max 200 characters. This will be shown as a short summary
                      of your project on the main page.
                    </PopoverContent>
                  </Popover>
                </div>
              }
            >
              {(field) => (
                <Textarea
                  {...field}
                  placeholder="Brief summary..."
                  className="bg-white shadow-xl"
                />
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
                  placeholder="Description"
                  className="bg-white shadow-xl"
                />
              )}
            </GenericFormField>

            <GenericFormField
              name="youtube"
              control={form.control}
              label="YouTube Link"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="https://youtube.com/..."
                  className="bg-white shadow-xl"
                />
              )}
            </GenericFormField>

            <GenericFormField
              name="gallery"
              control={form.control}
              label="Gallery (optional)"
            >
              {(field) => (
                <div className="flex flex-wrap gap-4">
                  {field.value?.map((url, index) => (
                    <div key={index} className="relative w-32 h-20">
                      <img
                        src={url}
                        alt={`gallery-${index}`}
                        className="w-full h-full object-cover rounded shadow"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = field.value.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(updated);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </GenericFormField>

            <GenericFormField
              name="newGallery"
              control={form.control}
              label="Add New Gallery Images"
            >
              {(field) => (
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => field.onChange(e.target.files)}
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
                <Select value={field.value} onValueChange={field.onChange}>
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
              label="Project Image"
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
                <div
                  key={item.id}
                  className="mb-4 space-y-2 border p-4 rounded bg-white rounded-lg"
                >
                  <GenericFormField
                    name={`members.${index}.email`}
                    control={form.control}
                    label="Member Email"
                  >
                    {(field) =>
                      index === 0 ? (
                        <Input
                          value={field.value}
                          disabled
                          className="bg-white shadow-xl"
                        />
                      ) : (
                        <EmailAutocomplete
                          users={userList}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )
                    }
                  </GenericFormField>

                  {index > 0 && (
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <Delete className="w-4 h-4" /> Delete Member
                    </Button>
                  )}
                </div>
              ))}

              <Button type="button" onClick={() => append({ email: "" })}>
                <div className="flex items-center gap-2">
                  <Plus />
                  Add Member
                </div>
              </Button>
            </div>

            <div className="flex items-center justify-center mt-12">
              <Button type="submit" className="text-lg shadow-lg">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default UserAddProject;
