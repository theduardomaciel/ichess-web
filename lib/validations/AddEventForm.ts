import { z } from "zod";

export const ACEs = [
	{
		id: "1",
		name: "Encontro para duelos construtivos no IC",
		description:
			"Consiste na realização de encontros entre os membros da ACE para a prática de partidas construtivas, visando o aprimoramento das habilidades estratégicas e táticas.",
		hours: 2,
	},
	{
		id: "2",
		name: "Encontro para duelos construtivos fora do IC",
		description:
			"Consiste na realização de encontros dos membros da ACE com alunos de fora do bloco, para a prática de partidas construtivas, visando o aprimoramento das habilidades estratégicas e táticas com outros alunos.",
		hours: 3,
	},
	{
		id: "3",
		name: "Treino de táticas retiradas de livros",
		description:
			"Consiste na realização de sessões de treinamento focadas em aprender táticas retiradas de livros de xadrez relevantes. Os membros estudarão e resolverão problemas com o objetivo de melhorar sua capacidade de visualização e cálculo de jogo.",
		hours: 2,
	},
	{
		id: "4",
		name: "Análise de partidas históricas",
		description:
			"Envolve a análise de partidas históricas de xadrez, permitindo aos membros do grupo aprenderem com partidas passadas que tiveram momentos icônicos.",
		hours: 2,
	},
	{
		id: "5",
		name: "Análise de partidas relevantes entre os membros",
		description:
			"Consiste na análise conjunta de partidas realizadas entre os membros da ACE. Dessa forma será possível ver as diferentes abordagens individuais dos jogadores, erros que comeram e pontos a serem fortalecidos.",
		hours: 2,
	},
	{
		id: "6",
		name: "Eventos abertos ao público e de assistência social",
		description:
			"Consiste no comprometimento da criação de eventos que busquem estender nossa paixão pelo xadrez para além dos limites acadêmicos de modo inclusivo e impactante.",
		hours: 5,
	},
];

type ACE = (typeof ACEs)[0]["id"];

const ACEsNames: [ACE, ...ACE[]] = [
	ACEs[0]["id"],
	...ACEs.slice(1).map((ace) => ace.id),
];

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
	ace: z.enum(ACEsNames, {
		required_error:
			"É necessário informar qual a ACE cumprida pelo evento.",
	}),
	type: z.enum(["internal", "external"], {
		required_error: "É necessário informar o tipo do evento",
	}),
});

export type AddEventFormSchema = z.infer<typeof addEventFormSchema>;
