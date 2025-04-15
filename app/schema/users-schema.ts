import { z } from "zod";

export const usersSchema = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
});

export type UsersSchema = z.infer<typeof usersSchema>;
export const teacherFormSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .optional()
    .or(z.literal("")),
  gender: z.enum(["1", "2", "3"], {
    required_error: "Please select a gender",
  }),
  birthday: z.date({
    required_error: "Please select a date of birth",
  }),
  address: z.string().optional(),
  username: z.string(),
  // .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),

  status: z.enum(["1", "2"], {
    required_error: "Please select a status",
  }),
  department: z.string({
    required_error: "Please select a department",
  }),
  // role: z.string({
  //   required_error: "Please select a role",
  // }),
  subjects: z
    .array(z.string())
    .min(1, { message: "Please select at least one subject" }),
  employmentDate: z.date({
    required_error: "Please select an employment date",
  }),
  avatar: z.any().optional(),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;
