import { userCourses, userPeriods } from "@ichess/drizzle/schema";
import { z } from "zod";

export const joinFormSection1Schema = z.object({
	name: z
		.string({ required_error: "Obrigatório" })
		.min(2, {
			message: "Um nome deve conter no mínimo 2 caracteres.",
		})
		.refine((value) => value.split(" ").length >= 2, {
			message: "Um nome completo deve conter pelo menos um sobrenome.",
		})
		.transform((value) => {
			return value
				.split(" ")
				.map((word) => {
					return word.charAt(0).toUpperCase() + word.slice(1);
				})
				.join(" ");
		}),
	course: z.enum(userCourses, { required_error: "Selecione uma opção" }),
	registrationId: z
		.string({ required_error: "Obrigatório" })
		.min(7, {
			message: "O número de matrícula é inválido.",
		})
		.max(9, { message: "O número de matrícula é inválido" }),
	period: z.enum(userPeriods, {
		required_error: "Selecione uma opção",
	}),
});

export type JoinFormSection1Schema = z.infer<typeof joinFormSection1Schema>;
