import { z } from "zod";

export const joinFormSection1Schema = z.object({
	name: z.string({ required_error: "Obrigatório" }).min(2, {
		message: "Um nome deve conter no mínimo 2 caracteres.",
	}),
	email: z
		.string({ required_error: "Obrigatório" })
		.email({ message: "E-mail inválido." })
		.refine(
			(email) => {
				return email.endsWith("ic.ufal.br");
			},
			{
				message:
					"Eita! Parece que você não inseriu um e-mail institucional...\nPara ingressar no IChess é necessário ser discente do IC. Caso você não faça parte, mas deseja se envolver em nossas atividades, confira os Eventos abertos ao público!",
			}
		),
	course: z.enum(["cc", "ec"], { required_error: "Selecione uma opção" }),
	registrationId: z.string({ required_error: "Obrigatório" }).min(7, {
		message: "O número de matrícula é inválido.",
	}),
	period: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"], {
		required_error: "Selecione uma opção",
	}),
});

export type JoinFormSection1Schema = z.infer<typeof joinFormSection1Schema>;
