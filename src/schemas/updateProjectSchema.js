import { z } from "zod";

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Project name is required." })
    .max(30, { message: "Project name must be at most 30 characters." }),
  internship: z.string().min(1, { message: "Internship is required." }),
  description: z
    .string()
    .min(1, { message: "Description is required." })
    .max(500, {
      message: "Project description must be at most 500 characters.",
    }),
  instructor: z.string().min(1, { message: "Instructor is required." }),
  year: z.coerce.number().int().min(2000, { message: "Enter a valid year." }),
  image: z
    .preprocess(
      (val) => (val instanceof FileList ? val : undefined),
      z
        .instanceof(FileList, { message: "Please upload an image." })
        .refine((files) => files.length > 0, {
          message: "Please upload at least one image.",
        })
        .refine((files) => files[0]?.size <= 30 * 1024 * 1024, {
          message: "Image size must not exceed 30MB.",
        })
    )
    .optional(),
  members: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Member name is required." }),
        email: z.string().email({ message: "Invalid email address." }),
      })
    )
    .min(1, { message: "At least one member is required." }),
});
