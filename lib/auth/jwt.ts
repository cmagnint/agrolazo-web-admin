import { decodeJwt } from "jose";
import { z } from "zod";

const adminPayloadSchema = z
  .object({
    id: z.number().int().positive(),
    email: z.string().min(1),
    type: z.literal("administrator"),
    exp: z.number().int().positive(),
  })
  .strict();

export type DecodedAdmin = z.infer<typeof adminPayloadSchema>;

export function decodeAdmin(token: string): DecodedAdmin {
  const payload = decodeJwt(token);
  const parsed = adminPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error("Invalid administrator token payload");
  }

  return parsed.data;
}
