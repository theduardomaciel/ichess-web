import { z } from "zod";

export const joinFormSection0Schema = z.object({
	email: z
		.string({ required_error: "Obrigatório" })
		.email({ message: "É necessário entrar com um e-mail institucional." }),
	name: z.string({ required_error: "Obrigatório" }),
});

export type JoinFormSection0Schema = z.infer<typeof joinFormSection0Schema>;
