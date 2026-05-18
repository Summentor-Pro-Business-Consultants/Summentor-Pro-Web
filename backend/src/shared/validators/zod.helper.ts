import z from "zod";

export function getZodEnum(
  getCodes: () => readonly number[],
  message: string = "Invalid status code.",
) {
  return z.coerce.number().refine((val) => getCodes().some((x) => val === x), {
    message,
  });
}
