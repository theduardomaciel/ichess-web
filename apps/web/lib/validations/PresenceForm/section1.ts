import { z } from "zod";

export const presenceFormSection1Schema = z.object({
	uniqueCode: z
		.string({
			required_error: "Por favor, insira o código único.",
		})
		.refine((value) => value.length === 6, {
			message: "O código único deve ter 6 caracteres.",
		}),
});

export type PresenceFormSection1Schema = z.infer<
	typeof presenceFormSection1Schema
>;
