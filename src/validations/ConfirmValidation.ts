import { z } from "zod";

export const confirmSchema = z.object({
    measure_uuid: z
    .string()
    .min(1, "O id da medição é obrigatório"),
    confirmed_value: z
    .number()
    .int()
    .min(1, { message: "A leitura é obrigatória" })   
});
