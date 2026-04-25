import { z } from "zod";

export const uuidParam = z.object({
    id: z.uuid({ error: "Invalid ID format" }),
});

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});
