import { z } from "zod";

export const uploadSchema = z.object({
  image: z
    .string()
    .min(1, "Imagem é obrigatória")
    .regex(
      /^data:image\/(png|jpeg|jpg);base64,([a-zA-Z0-9+/=]+)$/,
      "A imagem deve estar em formato Base64"
    ),
  measure_datetime: z
    .string()
    .min(1, { message: "A data de medição é obrigatória" })
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {
      message: "A data deve estar no formato yyyy-mm-dd",
    })
    .refine(
      (date) => {
        const [year, month, day] = date.split("-").map(Number);
        const parsedDate = new Date(year, month - 1, day);

        return (
          parsedDate.getFullYear() === year &&
          parsedDate.getMonth() === month - 1 &&
          parsedDate.getDate() === day
        );
      },
      { message: "A data de medição é inválida" }
    ),
  measure_type: z.string().min(1, "Tipo de medida é obrigatório"),
});
