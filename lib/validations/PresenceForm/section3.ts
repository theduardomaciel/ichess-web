import { z } from "zod";

export const presenceFormSection3Schema = z.object({
	rating: z.number().int().min(1).max(5).optional(),
	comments: z
		.string()
		.max(500, {
			message: "O campo deve ter no máximo 500 caracteres",
		})
		.optional(),
});

export type PresenceFormSection3Schema = z.infer<
	typeof presenceFormSection3Schema
>;
