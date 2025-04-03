import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["student", "instructor"]),
    internship: z.string().min(1, "Please select an internship"),
  });