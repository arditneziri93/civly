import { z } from "zod";

export const personalInformationSchema = z
  .object({
    name: z.string().min(1, { message: "First name is required" }),
    surname: z.string().min(1, { message: "Surname is required" }),

    profileUrl: z
      .url({ message: "Profile URL must be a valid URL" })
      .min(1, { message: "Profile URL is required" }),

    birthdate: z
      .string()
      .min(1, { message: "Birthdate is required" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Birthdate must be a valid ISO date (YYYY-MM-DD)",
      }),

    email: z
      .email({ message: "Email must be a valid address" })
      .optional()
      .or(z.literal("")),

    phone: z.string().optional(),

    location: z.string().optional(),

    linkedin: z
      .url({ message: "LinkedIn must be a valid URL" })
      .optional()
      .or(z.literal("")),

    xing: z
      .url({ message: "Xing must be a valid URL" })
      .optional()
      .or(z.literal("")),

    website: z
      .url({ message: "Website must be a valid URL" })
      .optional()
      .or(z.literal("")),

    professionalTitle: z.string().optional(),

    summary: z
      .string()
      .max(2000, {
        message: "Summary must not exceed 2000 characters",
      })
      .optional(),
  })
  .strict();

export type PersonalInformation = z.infer<typeof personalInformationSchema>;
