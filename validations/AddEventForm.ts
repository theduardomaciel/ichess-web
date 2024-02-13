import { z } from "zod";

export const addEventFormSchema = z.object({
	name: z.string({ required_error: "O nome do evento é obrigatório" }),
	description: z.string().optional(),
	responsible: z.array(z.string(), {
		required_error: "É necessário inserir ao menos um responsável",
	}),
	dateFrom: z.date({
		required_error: "É necessário inserir a data de início do evento",
	}),
	dateTo: z.date().optional(),
	ace: z.enum(["yes", "no"], {
		required_error:
			"É necessário informar qual a ACE cumprida pelo evento.",
	}),
});

export type AddEventFormSchema = z.infer<typeof addEventFormSchema>;
