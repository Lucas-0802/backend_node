import { z } from "zod";

export const listSchema = z.object({
  customer_code: z
    .string({
      required_error: "customer_code é obrigatório",
      invalid_type_error: "customer_code deve ser do tipo string",
    }),
    measure_type: z
    .string({
      required_error: "measure_type é obrigatório",
    })
    .transform((val) => val.toUpperCase())
    .refine((val) => val === "WATER" || val === "GAS", {
      message: "Tipo de medição não permitida"
    })
    .nullable()
});