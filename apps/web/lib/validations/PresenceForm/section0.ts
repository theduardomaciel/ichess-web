import { z } from "zod";

export const presenceFormSection0Schema = z.object({
	email: z
		.string({
			required_error: "Por favor, faça login com seu e-mail institucional.",
		})
		.optional(),
});

export type PresenceFormSection0Schema = z.infer<
	typeof presenceFormSection0Schema
>;
