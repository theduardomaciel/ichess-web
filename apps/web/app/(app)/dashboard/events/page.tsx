import { useId, Suspense } from "react";
import { Metadata } from "next";
import { env } from "@ichess/env";

import Link from "next/link";
// import { unstable_noStore } from "next/cache";

// Icons
import ErrorFaceIcon from "@/public/icons/error_face.svg";

// Components
import { EventPreview } from "@/components/events/EventPreview";
import { DashboardPagination } from "@/components/dashboard/Pagination";
import { ParamsResponsiblePicker } from "@/components/dashboard/ResponsiblePicker";

// Filters and Sorting
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SortBy } from "@/components/dashboard/SortBy";
import { PeriodFilter } from "@/components/dashboard/PeriodFilter";
import { AceFilter } from "@/components/dashboard/AceFilter";

// Validation
import { z } from "zod";
import { getEventsParams } from "@ichess/api/routers/events";

// API
import { serverClient } from "@/lib/trpc/server";

export const metadata: Metadata = {
	title: "Eventos",
	description: "Veja todos os eventos cadastrados",
};

const eventsPageParams = getEventsParams.extend({
	r: z.string().optional(),
});

export type EventsPageParams = z.infer<typeof eventsPageParams>;

export default async function EventsPage({
	searchParams,
}: {
	searchParams: EventsPageParams;
}) {
	const { page, pageSize, search, sortBy, periods, aces, moderators, r } =
		eventsPageParams.parse(searchParams);

	const { events, pageCount } = await serverClient.getEvents({
		projectId: env.PROJECT_ID,
		page,
		pageSize,
		search,
		sortBy,
		periods,
		aces,
		moderators,
	});

	// O "r" equivale ao estado da barra de pesquisa quando o usuário clica em "Limpar filtros"
	// Isso é feito por meio da mudança de key do componente SearchBar

	return (
		<main className="flex min-h-screen flex-col items-start justify-start gap-[var(--wrapper)] px-wrapper py-12 lg:flex-row lg:gap-12">
			<div className="flex flex-1 flex-col items-start justify-center gap-4">
				<div className="flex w-full flex-col items-start justify-start gap-4 sm:flex-row sm:gap-9">
					<SearchBar key={r} placeholder="Pesquisar eventos" />
					<div className="flex flex-row items-center justify-between gap-4 max-sm:w-full sm:justify-end">
						<span className="text-nowrap text-sm font-medium">
							Ordenar por
						</span>
						<SortBy sortBy={sortBy} />
					</div>
				</div>
				{
					<ul className="flex w-full flex-col items-start justify-start gap-4">
						{events && events.length > 0 ? (
							events.map((event) => (
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
				}
				{events && events.length > 0 && (
					<Suspense fallback={null}>
						<DashboardPagination
							pathname="/dashboard/events"
							currentPage={page}
							pageCount={pageCount}
						/>
					</Suspense>
				)}
			</div>
			<div className="flex w-full min-w-60 flex-col items-start justify-start gap-4 lg:w-[35%] lg:max-w-[17.5vw]">
				<div className="flex w-full flex-col items-start justify-start gap-9 rounded-lg bg-gray-400 p-6 ">
					<h6>Filtros</h6>
					<PeriodFilter />
					<AceFilter />
					<div className="flex w-full flex-col items-start justify-center gap-4">
						<p className="text-center text-sm font-medium text-neutral">
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
		<div className="inline-flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary-200/50 px-8 py-16">
			<ErrorFaceIcon />
			<p className="text-center font-title text-base font-bold text-neutral">
				Parece que não encontramos nada com base em sua pesquisa e
				filtros :(
			</p>
			<p className="text-center text-sm font-normal text-neutral sm:w-[50%]">
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
