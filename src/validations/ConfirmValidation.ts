import { z } from "zod";

export const confirmSchema = z.object({
  measure_uuid: z.string({
    required_error: "measure_uuid é obrigatório",
    invalid_type_error: "measure_uuid deve ser do tipo string",
  }).refine((val) => val.length === 24, {
    message: "measure_type deve ser WATER ou GAS",
  }),
  confirmed_value: z.number({
    required_error: "confirmed_value é obrigatório",
    invalid_type_error: "confirmed_value deve ser do tipo number",
  }),
});
