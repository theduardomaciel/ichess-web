import { z } from "zod";

export const addEventFormSchema = z.object({
	name: z.string({ required_error: "O nome do evento é obrigatório" }),
	description: z.string().optional(),
	responsible: z.array(z.string()).nonempty({
		message: "É necessário informar pelo menos um responsável",
	}),
	dateFrom: z.coerce.date({
		required_error: "É necessário inserir a data de início do evento",
	}),
	dateTo: z.coerce.date().optional(),
	timeFrom: z.string({
		required_error: "É necessário inserir o horário de início do evento",
	}),
	timeTo: z.string({
		required_error: "É necessário inserir o horário de término do evento",
	}),
	ace: z.string({
		required_error:
			"É necessário informar qual a ACE cumprida pelo evento.",
	}),
	type: z.enum(["internal", "external"], {
		required_error: "É necessário informar o tipo do evento",
	}),
});

export type AddEventFormSchema = z.infer<typeof addEventFormSchema>;
