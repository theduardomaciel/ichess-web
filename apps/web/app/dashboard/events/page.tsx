import { useId } from "react";

import Link from "next/link";
import Image from "next/image";

// Icons
import ErrorFaceIcon from "@/public/icons/error_face.svg";

// Components
import SearchBar from "@/components/dashboard/SearchBar";
import SortBy from "@/components/dashboard/SortBy";

import { EventPreview } from "@/components/events/EventPreview";
import { DashboardPagination } from "@/components/dashboard/Pagination";
import { Filter } from "@/components/dashboard/Filter";
import { ParamsResponsiblePicker } from "@/components/ResponsiblePicker";

// Types
import { ACEs } from "@/lib/validations/AddEventForm";
import { PERIODS, events } from "@/lib/fake_data";

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
				<div className="flex p-6 bg-gray-400 rounded-lg flex-col justify-start items-start gap-9 w-full ">
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
	const randomId = useId();
	// Math.floor(Math.random() * 1000);

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
				href={`/dashboard/events?r=${randomId}`}
				className="text-tertiary-200 underline"
			>
				Limpar filtros
			</Link>
		</div>
	);
}
