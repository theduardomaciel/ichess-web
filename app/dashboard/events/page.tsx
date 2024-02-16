import Link from "next/link";

// Icons
import CalendarIcon from "@/public/icons/calendar.svg";
import ErrorFaceIcon from "@/public/icons/error_face.svg";

// Components
import SearchBar from "@/components/dashboard/SearchBar";
import SortBy from "@/components/dashboard/SortBy";

import { AceLabel } from "@/components/dashboard/AceCard";
import { DashboardPagination } from "@/components/dashboard/Pagination";
import { Filter } from "@/components/dashboard/Filter";
import { ParamsResponsiblePicker } from "@/components/ResponsiblePicker";

// Types
import { z } from "zod";
import { ACEs, addEventFormSchema } from "@/lib/validations/AddEventForm";
import Image from "next/image";

type Event = z.infer<typeof addEventFormSchema> & { id: string };

const events: Event[] = [
	{
		id: "1",
		name: "Reunião de planejamento de eventos",
		description: undefined,
		responsible: ["1", "2"],
		dateFrom: new Date("2022-09-15T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		ace: "3",
	},
	{
		id: "2",
		name: "Reunião Semanal",
		description: "Reunião semanal para discutir os eventos da semana",
		responsible: ["1"],
		dateFrom: new Date("2022-02-24T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		ace: "1",
	},
	{
		id: "3",
		name: "Treino de táticas retiradas de livros",
		description:
			"Consiste na realização de sessões de treinamento focadas em aprender táticas retiradas de livros de xadrez relevantes. Os membros estudarão e resolverão problemas com o objetivo de melhorar sua capacidade de visualização e cálculo de jogo.",
		responsible: ["1", "2"],
		dateFrom: new Date("2022-09-15T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		ace: "3",
	},
	{
		id: "4",
		name: "Análise de partidas históricas",
		description:
			"Envolve a análise de partidas históricas de xadrez, permitindo aos membros do grupo aprenderem com partidas passadas que tiveram momentos icônicos.",
		responsible: ["1", "2"],
		dateFrom: new Date("2022-09-15T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		ace: "3",
	},
	{
		id: "5",
		name: "Análise de partidas relevantes entre os membros",
		description:
			"Consiste na análise conjunta de partidas realizadas entre os membros da ACE. Dessa forma será possível ver as diferentes abordagens individuais dos jogadores, erros que comeram e pontos a serem fortalecidos.",
		responsible: ["1", "2"],
		dateFrom: new Date("2022-09-15T00:00:00Z"),
		timeFrom: "14:00",
		timeTo: "16:00",
		ace: "3",
	},
];

const PERIODS = [
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

interface Moderator {
	name: string;
	image_url: string;
	id: string;
}

const moderators = [
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

const EVENTS_PER_PAGE = 3;

export default function EventsOverall({
	searchParams,
}: {
	searchParams: { [key: string]: string };
}) {
	const page = !isNaN(Number(searchParams.page))
		? Number(searchParams.page)
		: 1;

	const search = searchParams.search || undefined;

	const sortBy = searchParams.sortBy || "recent";

	const periods = searchParams.periods?.split(",");

	const aces = searchParams.aces?.split(",");

	const responsible = searchParams.responsible?.split(",");

	const hasBeenReset = searchParams.r; // Resetamos o estado da barra de pesquisa quando o usuário clica em "Limpar filtros"
	// Isso é feito por meio da mudança de key do componente SearchBar

	console.log({ searchParams });

	const filteredEvents = events
		.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE)
		.filter((event) => {
			if (
				(search &&
					!event.name.toLowerCase().includes(search.toLowerCase())) ||
				(search &&
					!event.description
						?.toLowerCase()
						.includes(search.toLowerCase()))
			) {
				console.log("search", search);
				return false;
			}

			if (periods) {
				const isValid = periods.some((period) => {
					const periodObj = PERIODS.find((p) => p.id === period);
					if (!periodObj) return false;

					return (
						event.dateFrom.getTime() >= periodObj.from.getTime() &&
						event.dateFrom.getTime() <= periodObj.to.getTime()
					);
				});
				if (!isValid) return false;
			}

			if (aces && !aces.includes(event.ace)) {
				return false;
			}

			if (
				responsible &&
				!responsible.some((id) => event.responsible.includes(id))
			) {
				return false;
			}

			return true;
		});

	console.log({ filteredEvents });

	return (
		<main className="flex min-h-screen flex-col lg:flex-row items-start justify-start px-wrapper py-12 gap-[var(--wrapper)] lg:gap-12">
			<div className="flex flex-col gap-4 items-start justify-center flex-1">
				<div className="flex flex-col sm:flex-row items-start justify-start gap-4 sm:gap-9 w-full">
					<SearchBar
						key={hasBeenReset}
						placeholder="Pesquisar eventos"
					/>
					<div className="flex flex-row items-center justify-between sm:justify-end gap-4 max-sm:w-full">
						<span className="text-sm font-medium text-nowrap">
							Ordenar por
						</span>
						<SortBy />
					</div>
				</div>
				<ul className="flex flex-col items-start justify-start w-full gap-4">
					{filteredEvents && filteredEvents.length > 0 ? (
						filteredEvents
							.sort((a, b) => {
								if (sortBy === "recent") {
									return (
										b.dateFrom.getTime() -
										a.dateFrom.getTime()
									);
								}
								return (
									a.dateFrom.getTime() - b.dateFrom.getTime()
								);
							})
							.map((event) => (
								<Link
									key={event.id}
									href={`/dashboard/events/${event.id}`}
									className="w-full"
								>
									<EventPreview event={event} />
								</Link>
							))
					) : (
						<Empty />
					)}
				</ul>
				{filteredEvents && filteredEvents.length > 0 && (
					<DashboardPagination
						pathname="/dashboard/events"
						searchParams={searchParams}
						total={events.length}
						perPage={EVENTS_PER_PAGE}
					/>
				)}
			</div>
			<div className="flex flex-col items-start justify-start gap-4 w-full min-w-60 lg:w-[35%] lg:max-w-[17.5vw]">
				<div className="flex p-6 bg-background-300 rounded-lg flex-col justify-start items-start gap-9 w-full ">
					<h6>Filtros</h6>
					<Filter
						title="Filtrar por período"
						prefix={"periods"}
						items={PERIODS.map((period) => {
							return { name: period.id, value: period.id };
						})}
					/>
					<Filter
						title="Filtrar por ACE"
						prefix={"aces"}
						items={ACEs.map((ace) => ({
							name: ace.name,
							value: ace.id,
						}))}
						linesAmount={2}
					/>
					<div className="flex flex-col justify-center items-start gap-4 w-full">
						<p className="text-center text-neutral text-sm font-medium">
							Filtrar por responsável
						</p>
						<ParamsResponsiblePicker />
					</div>
				</div>
			</div>
		</main>
	);
}

function Empty() {
	return (
		<div className="w-full px-8 py-16 rounded-2xl border border-dashed border-primary-200/50 flex-col justify-center items-center gap-4 inline-flex">
			<ErrorFaceIcon />
			<p className="text-neutral text-base font-bold font-title text-center">
				Parece que não encontramos nada com base em sua pesquisa e
				filtros :(
			</p>
			<p className="sm:w-[50%] text-neutral text-sm font-normal text-center">
				Tente procurar por algo com outras palavras, ou remover alguns
				filtros pra ver se você acha dessa vez!
			</p>
			<Link
				href={`/dashboard/events?r=true`}
				className="text-tertiary-200 underline"
			>
				Limpar filtros
			</Link>
		</div>
	);
}

function EventPreview({ event }: { event: Event }) {
	const ACE = ACEs.find((ace) => ace.id == event.ace);

	const responsible = event.responsible.map((id) => {
		const mod = moderators.find((mod) => mod.id === id);
		return mod;
	});
	const lastResponsible = responsible.length > 1 ? responsible.pop() : null;

	return (
		<li className="flex flex-col items-start justify-start p-9 gap-4 bg-background-200 rounded-lg w-full hover:bg-background-300 hover:outline outline-background-100 transition-[background-color,outline]">
			<div className="flex flex-row items-center justify-between flex-wrap w-full gap-2">
				<h3 className="text-lg lg:text-xl font-extrabold font-title leading-snug text-left">
					{event.name}
				</h3>
				<p className="opacity-50 text-neutral text-xs lg:text-base font-semibold leading-none">
					#{event.id}
				</p>
			</div>
			{event.description && (
				<p className="text-sm lg:text-base text-muted font-medium">
					{event.description}
				</p>
			)}
			<div className="flex flex-row flex-wrap items-center gap-4 justify-between w-full">
				{ACE && <AceLabel ace={ACE} />}
				<div className="flex flex-row items-center justify-between">
					<div className="flex flex-row items-center justify-start gap-2">
						<CalendarIcon />
						<span className="text-sm lg:text-base font-medium leading-none mt-0.5">
							{event.dateFrom.toLocaleDateString("pt-BR", {
								year: "numeric",
								month: "2-digit",
								day: "numeric",
							})}
						</span>
					</div>
					{/* <span className="text-sm font-medium">{event.timeFrom}</span> */}
				</div>
			</div>
			<div className="flex flex-row items-center justify-between pt-4 border-t border-t-background-100 w-full">
				<div className="flex flex-row items-center justify-start gap-2">
					<ProfileImages
						image_urls={responsible
							.map((mod) => mod!.image_url)
							.concat(lastResponsible?.image_url || [])}
					/>
					<span className="text-right text-neutral text-sm font-semibold">
						Organizado por{" "}
						{responsible.map((mod) => mod?.name).join(", ")}{" "}
						{lastResponsible && "e"} {lastResponsible?.name}
					</span>
				</div>
				<p className="text-right text-neutral text-sm font-semibold">
					+ de <span className="underline">10 membros</span>{" "}
					participaram
				</p>
			</div>
		</li>
	);
}

function ProfileImages({ image_urls }: { image_urls: string[] }) {
	return (
		<div className="flex flex-row items-center justify-start">
			{image_urls.map((url) => (
				<Image
					src={url}
					alt="Profile Image"
					key={url}
					height={24}
					width={24}
					className="w-6 h-6 min-w-6 rounded-full -ml-2"
				/>
			))}
		</div>
	);
}
