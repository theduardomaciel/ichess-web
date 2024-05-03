import { z } from "zod";

export const presenceFormSection2Schema = z.object({
	rating: z.number().int().min(1).max(5).optional(),
	comments: z
		.string()
		.max(500, {
			message: "O campo deve ter no máximo 500 caracteres",
		})
		.optional(),
});

export type PresenceFormSection2Schema = z.infer<
	typeof presenceFormSection2Schema
>;
