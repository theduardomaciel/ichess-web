import { z } from "zod";
import { addEventFormSchema } from "@/lib/validations/AddEventForm";

export type Event = z.infer<typeof addEventFormSchema> & { id: string };

interface Moderator {
	name: string;
	image_url: string;
	id: string;
}

export const moderators = [
	{
		name: "John Doe",
		image_url: "https://randomuser.me/api/portraits/men/18.jpg",
		id: "1",
	},
	{
		name: "Marcelo Silva",
		image_url: "https://randomuser.me/api/portraits/men/19.jpg",
		id: "2",
	},
	{
		name: "Marcos Melo",
		image_url: "https://randomuser.me/api/portraits/men/20.jpg",
		id: "3",
	},
	{
		name: "Luciano Cesa",
		image_url: "https://github.com/mark.png",
		id: "4",
	},
	{
		name: "Márcio Cavalcante",
		image_url: "https://randomuser.me/api/portraits/men/21.jpg",
		id: "5",
	},
] as Moderator[];

export const events: Event[] = [
	{
		id: "F9798",
		name: "Curso de Xadrez para Menores",
		description:
			"Um workshop de xadrez gratuito para menores de 18 anos oferecido pelo projeto de extensão IChess no IC.",
		responsible: ["1", "2", "3"],
		dateFrom: new Date("2022-01-30T00:00:00Z"),
		timeFrom: "13:00",
		timeTo: "17:00",
		type: "external",
		ace: "6",
	},
	{
		id: "EHD723",
		name: "Reunião de planejamento de eventos",
		description: undefined,
		responsible: ["1", "2"],
		dateFrom: new Date("2022-09-15T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		type: "internal",
		ace: "3",
	},
	{
		id: "DHD723",
		name: "Reunião Semanal",
		description: "Reunião semanal para discutir os eventos da semana",
		responsible: ["1"],
		dateFrom: new Date("2022-02-24T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		type: "internal",
		ace: "1",
	},
	{
		id: "UHD723",
		name: "Treino de táticas retiradas de livros",
		description:
			"Consiste na realização de sessões de treinamento focadas em aprender táticas retiradas de livros de xadrez relevantes. Os membros estudarão e resolverão problemas com o objetivo de melhorar sua capacidade de visualização e cálculo de jogo.",
		responsible: ["1", "2"],
		dateFrom: new Date("2022-09-15T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		type: "internal",
		ace: "3",
	},
	{
		id: "IHD723",
		name: "Análise de partidas históricas",
		description:
			"Envolve a análise de partidas históricas de xadrez, permitindo aos membros do grupo aprenderem com partidas passadas que tiveram momentos icônicos.",
		responsible: ["1", "2"],
		dateFrom: new Date("2022-09-15T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		type: "internal",
		ace: "3",
	},
	{
		id: "OHD723",
		name: "Análise de partidas relevantes entre os membros",
		description:
			"Consiste na análise conjunta de partidas realizadas entre os membros da ACE. Dessa forma será possível ver as diferentes abordagens individuais dos jogadores, erros que comeram e pontos a serem fortalecidos.",
		responsible: ["1", "2"],
		dateFrom: new Date("2022-09-15T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		type: "internal",
		ace: "3",
	},
];

export const PERIODS = [
	{
		id: "2022.1",
		from: new Date("2022-01-01T00:00:00Z"),
		to: new Date("2022-06-30T23:59:59Z"),
	},
	{
		id: "2022.2",
		from: new Date("2022-07-01T00:00:00Z"),
		to: new Date("2022-12-31T23:59:59Z"),
	},
	{
		id: "2023.1",
		from: new Date("2023-01-01T00:00:00Z"),
		to: new Date("2023-06-30T23:59:59Z"),
	},
	{
		id: "2023.2",
		from: new Date("2023-07-01T00:00:00Z"),
		to: new Date("2023-12-31T23:59:59Z"),
	},
	{
		id: "2024.1",
		from: new Date("2024-01-01T00:00:00Z"),
		to: new Date("2024-06-30T23:59:59Z"),
	},
	{
		id: "2024.2",
		from: new Date("2024-07-01T00:00:00Z"),
		to: new Date("2024-12-31T23:59:59Z"),
	},
];
