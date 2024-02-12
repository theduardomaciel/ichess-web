import { z } from "zod";

export const joinFormSection3Schema = z.object({
	reason: z
		.string()
		.max(250, { message: "Desculpe, o limite de caracteres é 250 :(" })
		.optional(),
	discovery: z.enum(["social_media", "friends", "other"]).optional(),
	discoveryOther: z.string().max(50).optional(),
});

export type JoinFormSection3Schema = z.infer<typeof joinFormSection3Schema>;
