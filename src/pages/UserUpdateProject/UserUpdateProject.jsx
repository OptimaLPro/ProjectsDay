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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ToastMessage from "@/components/ui/ToastMessage";
import { useInstructors } from "@/hooks/useInstructors";
import { useInternships } from "@/hooks/useInternships";
import { useMyProject } from "@/hooks/useMyProject";
import { useUserEmails } from "@/hooks/useUserEmails";
import { compressImage } from "@/lib/compressImage";
import { updateProjectSchema } from "@/schemas/updateProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Info, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function UserUpdateProject() {
  const [didReset, setDidReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const { data: userList = [] } = useUserEmails();

  const form = useForm({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      // project_id: "",
      name: "",
      internship: "",
      description: "",
      short_description: "",
      youtube: "",
      gallery: [],
      newGallery: undefined,
      instructor: "",
      year: new Date().getFullYear(),
      image: undefined,
      members: [{ email: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const allReady =
    projectData?.project &&
    internshipsData &&
    instructorsData &&
    userList.length > 0 &&
    !didReset;

  useEffect(() => {
    if (!allReady) return;
    const {
      // project_id,
      name,
      internship,
      description,
      short_description,
      youtube,
      gallery,
      instructor,
      year,
      members,
    } = projectData.project;
    const instructorObj = instructorsData.find((i) => i._id === instructor);
    const memberObjects = (members || []).map((id) => {
      const user = userList.find((u) => u._id === id);
      return { email: user?.email || "" };
    });
    form.reset({
      // project_id,
      name,
      internship,
      description,
      short_description: short_description ?? "",
      youtube: youtube ?? "",
      gallery: gallery ?? [],
      newGallery: undefined,
      instructor: instructorObj?.name ?? "",
      year,
      image: undefined,
      members: memberObjects,
    });
    setDidReset(true);
  }, [allReady]);

  const onSubmit = async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let newGalleryFiles = values.newGallery || [];
    newGalleryFiles = await Promise.all(
      Array.from(newGalleryFiles).map((file) => compressImage(file, 1024, 0.7))
    );
    let imageFile = values.image?.[0];
    if (imageFile) imageFile = await compressImage(imageFile, 1024, 0.7);
    const formData = new FormData();
    const emailToIdMap = {};
    userList.forEach((user) => {
      emailToIdMap[user.email] = user._id;
    });
    const memberIds = values.members
      .map((m) => emailToIdMap[m.email])
      .filter(Boolean);
    // formData.append("project_id", values.project_id);
    formData.append("name", values.name);
    formData.append("internship", values.internship);
    formData.append("description", values.description);
    formData.append("short_description", values.short_description);
    formData.append("youtube", values.youtube);
    formData.append("instructor", values.instructor);
    formData.append("year", String(values.year));
    formData.append("members", JSON.stringify(memberIds));
    formData.append("gallery", JSON.stringify(values.gallery));
    if (imageFile) formData.append("image", imageFile);
    Array.from(newGalleryFiles).forEach((file) =>
      formData.append("newGalleryFiles", file)
    );
    try {
      await api.put(`/projects/${projectData.project._id}`, formData);
      navigate("/dashboard");
      ToastMessage({
        type: "success",
        message: "Project updated successfully.",
      });
    } catch {
      ToastMessage({ type: "error", message: "Failed to update project." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (projectError || internshipsError || instructorsError) return <Error />;
  if (projectLoading || internshipsLoading || instructorsLoading || !didReset)
    return <Loader />;

  return (
    <div className="relative mx-auto w-[80%] max-w-[600px] mt-4">
      <h1 className="mb-8 text-2xl font-bold text-center">
        Update Your Project
      </h1>
      <Card className="p-6 transition-all border shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* <GenericFormField
              name="project_id"
              control={form.control}
              label={
                <div className="flex items-center gap-2">
                  Project ID
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 p-0"
                      >
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="max-w-xs text-sm"
                      side="top"
                      align="start"
                      collisionPadding={10}
                    >
                      Your Project ID as in the Excel sheet from the Faculty
                      about the groups for each internship. (i.e: 311)
                    </PopoverContent>
                  </Popover>
                </div>
              }
            >
              {(field) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter project ID"
                  onChange={(e) => field.onChange(e.target.value)}
                  className="bg-white shadow-xl"
                />
              )}
            </GenericFormField> */}
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
                    <SelectValue placeholder="Select internship" />
                  </SelectTrigger>
                  <SelectContent>
                    {internshipsData?.map((i) => (
                      <SelectItem key={i._id} value={i._id}>
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
              {(field) => (
                <Textarea
                  {...field}
                  placeholder="Description"
                  className="bg-white shadow-xl"
                />
              )}
            </GenericFormField>
            <GenericFormField
              name="short_description"
              control={form.control}
              label="Short Description"
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
              label="Gallery (remove existing)"
            >
              {(field) => (
                <div className="flex flex-wrap gap-4">
                  {field.value?.map((url, idx) => (
                    <div key={idx} className="relative w-32 h-20">
                      <img
                        src={url}
                        alt={`gallery-${idx}`}
                        className="object-cover w-full h-full rounded shadow"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(
                            field.value.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute top-0 right-0 w-5 h-5 text-white bg-red-500 rounded-full"
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
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="bg-white shadow-xl">
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructorsData?.map((inst) => (
                      <SelectItem key={inst.id} value={inst.name}>
                        {inst.name}
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
              <h2 className="mb-2 text-xl font-semibold">Team Members</h2>
              {fields.map((item, idx) => (
                <div key={item.id} className="p-4 mb-4 bg-white border rounded">
                  <GenericFormField
                    name={`members.${idx}.email`}
                    control={form.control}
                    label="Member Email"
                  >
                    {(field) => (
                      <EmailAutocomplete
                        users={userList}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  </GenericFormField>
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => remove(idx)}
                  >
                    <Delete className="w-4 h-4" /> Delete Member
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => append({ email: "" })}>
                Add Member
              </Button>
            </div>
            <div className="flex justify-center my-12">
              {isSubmitting ? (
                <ButtonLoading />
              ) : (
                <Button type="submit" className="text-lg shadow-lg">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default UserUpdateProject;
