import { z } from "zod";

export const presenceFormSection2Schema = z.object({
	uniqueCode: z
		.string({
			required_error: "Por favor, insira o código único.",
		})
		.refine((value) => value.length === 6, {
			message: "O código único deve ter 6 caracteres.",
		}),
});

export type PresenceFormSection2Schema = z.infer<
	typeof presenceFormSection2Schema
>;
