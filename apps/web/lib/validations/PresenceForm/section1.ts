import { z } from "zod";

export const presenceFormSection1Schema = z.object({
	email: z
		.string({
			required_error:
				"Por favor, faça login com seu e-mail institucional.",
		})
		.optional(),
	rememberMe: z.boolean().default(false),
});

export type PresenceFormSection1Schema = z.infer<
	typeof presenceFormSection1Schema
>;
