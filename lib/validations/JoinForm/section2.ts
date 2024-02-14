import { z } from "zod";

export const joinFormSection2Schema = z.object({
	experience: z.enum(["inexperienced", "rookie", "competitor", "master"], {
		required_error: "Por favor, selecione uma opção",
	}),
	username: z.string({ required_error: "Obrigatório" }).min(4, {
		message: "O nick do Chess.com é inválido.",
	}),
});

export type JoinFormSection2Schema = z.infer<typeof joinFormSection2Schema>;
