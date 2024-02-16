// Icons
import CalendarIcon from "@/public/icons/calendar.svg";

// Components
import SearchBar from "@/components/dashboard/SearchBar";
import SortBy from "@/components/dashboard/SortBy";

// Types
import { z } from "zod";
import { ACEs, addEventFormSchema } from "@/lib/validations/AddEventForm";
import { AceLabel } from "@/components/dashboard/AceCard";
import DashboardPagination from "@/components/dashboard/Pagination";
import { Filter } from "@/components/dashboard/Filter";
import { ResponsiblePicker } from "@/components/ResponsiblePicker";

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

const PERIODS = ["2023.1", "2023.2", "2024.1", "2024.2"];

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

	return (
		<main className="flex min-h-screen flex-col items-start justify-start px-wrapper py-12 gap-[var(--wrapper)]">
			<div className="flex flex-col gap-4 items-start justify-center w-full">
				<SearchBar placeholder="Pesquisar eventos" />
				<div className="flex flex-row items-center justify-between w-full">
					<span className="text-sm font-medium">Ordenar por</span>
					<SortBy />
				</div>
				<ul className="flex flex-col items-start justify-start w-full gap-4">
					{events
						.slice(
							(page - 1) * EVENTS_PER_PAGE,
							page * EVENTS_PER_PAGE
						)
						.filter((event) =>
							search
								? event.name
										.toLowerCase()
										.includes(search.toLowerCase())
								: true
						)
						.sort((a, b) => {
							if (sortBy === "recent") {
								return (
									b.dateFrom.getTime() - a.dateFrom.getTime()
								);
							}
							return a.dateFrom.getTime() - b.dateFrom.getTime();
						})
						.map((event) => (
							<EventPreview key={event.id} event={event} />
						))}
				</ul>
				<DashboardPagination
					pathname="/dashboard/events"
					searchParams={searchParams}
					total={events.length}
					perPage={EVENTS_PER_PAGE}
				/>
			</div>
			<div className="flex flex-col items-start justify-start gap-4 w-full">
				<div className="flex p-6 bg-background-300 rounded-lg flex-col justify-start items-start gap-9 w-full ">
					<h6>Filtros</h6>
					<Filter
						title="Filtrar por período"
						items={PERIODS.map((period) => {
							return { name: period, value: period };
						})}
					/>
					<Filter
						title="Filtrar por ACE"
						items={ACEs.map((ace) => ({
							name: ace.name,
							value: ace.id,
						}))}
					/>
					<div className="flex flex-col justify-center items-start gap-4">
						<p className="text-center text-neutral text-sm font-medium">
							Filtrar por responsável
						</p>
						{/* <ResponsiblePicker /> */}
					</div>
				</div>
			</div>
		</main>
	);
}

function EventPreview({ event }: { event: Event }) {
	const ACE = ACEs.find((ace) => ace.id == event.ace);

	return (
		<li className="flex flex-col items-start justify-start p-9 gap-4 bg-background-200 rounded-lg w-full">
			<div className="flex flex-row items-center justify-between flex-wrap w-full gap-2">
				<h3 className="text-lg font-extrabold font-title leading-snug text-left">
					{event.name}
				</h3>
				<p className="opacity-50 text-neutral text-xs font-semibold leading-none">
					#{event.id}
				</p>
			</div>
			{event.description && (
				<p className="text-sm text-muted font-medium ">
					{event.description}
				</p>
			)}
			{ACE && <AceLabel ace={ACE} />}
			<div className="flex flex-row items-center justify-between w-full">
				<div className="flex flex-row items-center justify-start gap-2">
					<CalendarIcon />
					<span className="text-sm font-medium leading-none mt-0.5">
						{event.dateFrom.toLocaleDateString("pt-BR", {
							month: "2-digit",
							day: "numeric",
						})}
					</span>
				</div>
				{/* <span className="text-sm font-medium">{event.timeFrom}</span> */}
			</div>
		</li>
	);
}
