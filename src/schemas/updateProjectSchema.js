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
    .max(500, { message: "Project description must be at most 500 characters." }),

  short_description: z
    .string()
    .max(200, { message: "Short description must be at most 200 characters." })
    .optional(),

  youtube: z
    .string()
    .url({ message: "Invalid YouTube link." })
    .or(z.literal("")),

  gallery: z.array(z.string().url()).optional(),

  newGallery: z
    .preprocess(
      (val) => (val instanceof FileList ? val : undefined),
      z
        .instanceof(FileList)
        .refine((files) => Array.from(files).every(f => f.size <= 10 * 1024 * 1024), {
          message: "Each gallery image must be under 10MB.",
        })
    )
    .optional(),

  instructor: z.string().min(1, { message: "Instructor is required." }),

  year: z.coerce.number().int().min(2000, { message: "Enter a valid year." }),

  image: z
    .preprocess(
      (val) => (val instanceof FileList ? val : undefined),
      z
        .instanceof(FileList)
        .refine((files) => files.length === 0 || files[0]?.size <= 30 * 1024 * 1024, {
          message: "Image must be under 30MB.",
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
