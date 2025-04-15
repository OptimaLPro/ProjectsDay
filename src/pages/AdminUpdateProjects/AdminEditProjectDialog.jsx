import api from "@/api/api";
import GenericFormField from "@/components/GenericFormField/GenericFormField";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { updateProjectSchema } from "@/schemas/updateProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Save } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import EmailAutocomplete from "@/components/ui/EmailAutocomplete";
import { useUserEmails } from "@/hooks/useUserEmails";
import { useQuery } from "@tanstack/react-query";

const fetchAwards = async () => {
  const { data } = await api.get("/awards");
  return data;
};

export default function EditProjectDialog({ project, onClose, onSave }) {
  const { data: internships, isLoading: loadingInternships } = useInternships();
  const { data: instructors, isLoading: loadingInstructors } = useInstructors();
  const { data: userList = [] } = useUserEmails();
  const { data: awardsList = [] } = useQuery({
    queryKey: ["awards"],
    queryFn: fetchAwards,
  });

  const form = useForm({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
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
      awards: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  useEffect(() => {
    if (project && internships && instructors && userList.length > 0) {
      const {
        name,
        internship,
        description,
        short_description,
        youtube,
        gallery,
        instructor,
        year,
        members,
        awards,
      } = project;

      const internshipObj = internships.find((i) => i._id === internship);
      const instructorObj = instructors.find((i) => i._id === instructor);

      const mappedEmails = members
        .map((memberId) => {
          const idStr =
            typeof memberId === "string"
              ? memberId
              : memberId?.$oid || memberId?.toString();

          const found = userList.find((u) => u._id === idStr);
          return found?.email || null;
        })
        .filter(Boolean);
      form.reset({
        name,
        internship: internshipObj?._id ?? "",
        description,
        short_description: short_description ?? "",
        youtube: youtube ?? "",
        gallery: gallery ?? [],
        newGallery: undefined,
        instructor: instructorObj?._id ?? "",
        year,
        image: undefined,
        members: mappedEmails.map((email) => ({ email })),
        awards: awards?.map((a) => (typeof a === "string" ? a : a._id)) ?? [],
      });
    }
  }, [project, internships, instructors, userList]);

  const onSubmit = async (values) => {
    const imageFile = values.image?.[0];
    const newGalleryFiles = values.newGallery || [];

    const emailToIdMap = {};
    userList.forEach((user) => {
      emailToIdMap[user.email] = user._id;
    });

    const memberIds = values.members
      .map((m) => emailToIdMap[m.email])
      .filter(Boolean);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("internship", values.internship);
    formData.append("description", values.description);
    formData.append("short_description", values.short_description);
    formData.append("youtube", values.youtube);
    formData.append("instructor", values.instructor);
    formData.append("year", String(values.year));
    formData.append("members", JSON.stringify(memberIds));
    formData.append("gallery", JSON.stringify(values.gallery));
    formData.append("awards", JSON.stringify(values.awards ?? []));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    Array.from(newGalleryFiles).forEach((file) => {
      formData.append("newGalleryFiles", file);
    });

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
                    {internships
                      ?.filter((i) => i.name !== "All")
                      .map((i) => (
                        <SelectItem key={i._id} value={i._id}>
                          {i.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </GenericFormField>

            <GenericFormField
              name="short_description"
              control={form.control}
              label="Short Description"
            >
              {(field) => <Textarea {...field} placeholder="Brief summary" />}
            </GenericFormField>

            <GenericFormField
              name="description"
              control={form.control}
              label="Description"
            >
              {(field) => <Textarea {...field} placeholder="Description" />}
            </GenericFormField>

            <GenericFormField
              name="youtube"
              control={form.control}
              label="YouTube Link"
            >
              {(field) => (
                <Input {...field} placeholder="https://youtube.com/..." />
              )}
            </GenericFormField>

            <GenericFormField
              name="gallery"
              control={form.control}
              label="Gallery (remove existing)"
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
                    {instructors?.map((i) => (
                      <SelectItem key={i._id} value={i._id}>
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
              <h2 className="text-xl font-semibold mb-2">Team Members</h2>
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="mb-4 space-y-2 border p-4 rounded"
                >
                  <GenericFormField
                    name={`members.${index}.email`}
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
                    onClick={() => remove(index)}
                  >
                    <Delete className="w-4 h-4" /> Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => append("")}>
                Add Member
              </Button>
            </div>

            <GenericFormField
              name="awards"
              control={form.control}
              label="Awards"
            >
              {(field) => (
                <>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (!Array.isArray(field.value)) {
                        field.onChange([value]);
                      } else if (!field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add award" />
                    </SelectTrigger>
                    <SelectContent>
                      {awardsList.map((award) => (
                        <SelectItem key={award._id} value={award._id}>
                          {award.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((awardId) => {
                      const award = awardsList.find((a) => a._id === awardId);
                      return (
                        <div
                          key={awardId}
                          className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full"
                        >
                          <img
                            src={award?.image}
                            alt={award?.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{award?.name}</span>
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((id) => id !== awardId)
                              )
                            }
                            className="text-red-500 font-bold text-sm"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </GenericFormField>

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
