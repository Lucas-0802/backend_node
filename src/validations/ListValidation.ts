import { z } from "zod";

export const listSchema = z.object({
  customer_code: z
    .string()
    .min(1, "O customer_code é obrigatório"),
  measure_type: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => val === "WATER" || val === "GAS", {
      message: "Tipo de medição não permitida.",
    })
    .nullable(),
});