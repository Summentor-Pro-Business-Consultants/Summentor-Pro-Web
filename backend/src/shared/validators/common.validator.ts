import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import z from "zod";

extendZodWithOpenApi(z);

export function isValidPhoneNumber(value: string): boolean {
  const phone = parsePhoneNumberFromString(value);
  return phone?.isValid() ?? false;
}

export const ZodUrlEndpoint = z.string().refine((value: string) => !value.includes("://"), {
  message: "Invalid endpoint: URLs with protocol are not allowed",
});

export const ZodMobileNumber = z.string().refine(isValidPhoneNumber, {
  message: "Invalid phone number",
});

export const ZodBigIntId = z
  .string()
  .regex(/^\d+$/, "ID must be numeric")
  .transform((val) => BigInt(val));
