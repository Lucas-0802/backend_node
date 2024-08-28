import { z } from "zod";

export const listSchema = z.object({
    id: z
    .string()
    .min(1, "O id é obrigatório")   
});