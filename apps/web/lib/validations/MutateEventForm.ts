import { z } from "zod";
import { eventTypes } from "@ichess/drizzle/schema";

export const mutateEventFormSchema = z.object({
	name: z.string({ required_error: "O nome do evento é obrigatório" }),
	description: z.string().optional(),
	members: z.union([z.array(z.string()), z.string()]).default([]),
	/* 
	required_error:
			"É necessário informar pelo menos um moderador responsável pelo evento",
	*/
	dateFrom: z.coerce.date({
		required_error: "É necessário inserir a data de início do evento",
	}),
	/* dateTo: z.coerce.date() */
	timeFrom: z.string({
		required_error: "É necessário inserir o horário de início do evento",
	}),
	timeTo: z.string({
		required_error: "É necessário inserir o horário de término do evento",
	}),
	aceId: z.string({
		required_error:
			"É necessário informar qual a ACE cumprida pelo evento.",
	}),
	type: z.enum(eventTypes, {
		required_error: "É necessário informar o tipo do evento",
	}),
});

export type MutateEventFormSchema = z.infer<typeof mutateEventFormSchema>;
