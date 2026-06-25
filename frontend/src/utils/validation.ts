import { z } from "zod";
export const loginSchema = z.object({
    email: z.email({ error: "Enter a valid email address" }),
    password: z.string().min(1, { error: "Password is required" }),
});

export const registerSchema = z.object({
    name: z.string().min(2, { error: "Name must be at least 2 characters" }).max(100, { error: "Name is too long" }),
    email: z.email({ error: "Enter a valid email address" }),
    password: z.string().min(8, { error: "Password must be at least 8 characters" }).regex(/[A-Z]/, { error: "Include at least one uppercase letter" }).regex(/[0-9]/, { error: "Include at least one number" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
