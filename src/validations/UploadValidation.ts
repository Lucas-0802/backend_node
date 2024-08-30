import { z } from "zod";

export const uploadSchema = z.object({
  image: z
    .string({
      required_error: "image é obrigatório",
      invalid_type_error: "Imagem deve ser do tipo string",
    })
    .regex(
      /^data:image\/(png|jpeg|jpg);base64,([a-zA-Z0-9+/=]+)$/,
      "A imagem de estar em formato Base64"
    ),
  customer_code: z.string({
    required_error: "customer_code é obrigatório",
    invalid_type_error: "customer_code deve ser do tipo string",
  }),
  measure_datetime: z
    .string({
      required_error: "measure_datetime é obrigatório",
      invalid_type_error: "measure_datetime deve ser do tipo string",
    })
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {
      message: "Date must be in the format YYYY-MM-DD",
    }),
  measure_type: z
    .string({
      required_error: "measure_type é obrigatório",
    })
    .transform((val) => val.toUpperCase())
    .refine((val) => val === "WATER" || val === "GAS", {
      message: "measure_type deve ser WATER ou GAS",
    }),
});
