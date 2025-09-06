import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "E-Mail is invalid!"
  })
});

export const loginSchema = z.object({
  email: z.email({
    message: "E-Mail is invalid!"
    }),
  password: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(6, "Name must be at least 2 characters")
    .max(100, "Name must be less than 30 characters"),
  email: z.email({
    message: "E-Mail is invalid!"
    }),
  password: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ['confirmPassword'],
  });

  export type FormState = {
    success?: boolean;
    message?: string;
    data?: {
        name?: string;
        email?: string;
        password?: string;
    };
    backendErrors?: {
        name?: string;
        message?: string; 
    } | null;
    zodErrors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    } | null;
  };