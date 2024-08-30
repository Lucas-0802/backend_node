import { z } from "zod";

export const uploadSchema = z.object({    
  image: z
    .string({
      required_error: "image is required",
      invalid_type_error: "image must be a string",
    })
    .regex(
      /^data:image\/(png|jpeg|jpg);base64,([a-zA-Z0-9+/=]+)$/,
      "The image must be a Base64 string with a valid PNG, JPEG, or JPG format"
    ),
    customer_code: z
    .string({
      required_error: "customer_code is required",
      invalid_type_error: "customer_code must be a string",
    }),
  measure_datetime: z
    .string({
      required_error: "measure_datetime is required",
      invalid_type_error: "measure_datetime must be a string",
    })
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {
      message: "Date must be in the format YYYY-MM-DD",
    }),
    measure_type: z
    .string({
      required_error: "measure_type is required"
    })
    .transform((val) => val.toUpperCase())
    .refine((val) => val === "WATER" || val === "GAS", {
      message: "measure_type must be WATER or GAS"
    })
});
