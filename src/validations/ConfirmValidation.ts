import { z } from "zod";

export const confirmSchema = z.object({
  measure_uuid: z.string({
    required_error: "measure_uuid is required",
    invalid_type_error: "measure_uuid must be a string",
  }),
  confirmed_value: z.number({
    required_error: "confirmed_value is required",
    invalid_type_error: "confirmed_value must be a number",
  }),
});
