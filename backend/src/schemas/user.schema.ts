import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters").trim().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
