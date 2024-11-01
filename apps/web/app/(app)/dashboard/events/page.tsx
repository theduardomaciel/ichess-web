import { Suspense } from "react";
import type { Metadata } from "next";

import Link from "next/link";
// import { unstable_noStore } from "next/cache";

// Components
import { EventPreview } from "@/components/events/EventPreview";
import { PagesDisplay } from "@/components/Pagination";
import { Empty } from "@/components/Empty";

// Filters and Sorting
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SortBy } from "@/components/dashboard/SortBy";

import { Filters } from "@/components/dashboard/filters";
import { PeriodFilter } from "@/components/dashboard/filters/PeriodFilter";
import { AceFilter } from "@/components/dashboard/filters/AceFilter";
import { ModeratorFilter } from "@/components/dashboard/filters/ModeratorFilter";

// Validation
import { z } from "zod";
import { getEventsParams } from "@ichess/api/routers/events";

// API
import { env } from "@ichess/env";
import { serverClient } from "@/lib/trpc/server";

export const metadata: Metadata = {
	title: "Eventos",
	description: "Veja todos os eventos cadastrados",
};

const eventsPageParams = getEventsParams.extend({
	r: z.string().optional(),
});

export type EventsPageParams = z.infer<typeof eventsPageParams>;

export default async function DashboardEventsPage(
	props: {
		searchParams: Promise<EventsPageParams>;
	}
) {
	const searchParams = await props.searchParams;
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
						<span className="text-nowrap text-sm font-medium">Ordenar por</span>
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
							<Empty href={"/dashboard/events"} />
						)}
					</ul>
				}
				{events && events.length > 0 && (
					<Suspense fallback={null}>
						<PagesDisplay currentPage={page || 1} pageCount={pageCount} />
					</Suspense>
				)}
			</div>
			<Filters>
				<ModeratorFilter projectId={env.PROJECT_ID} />
			</Filters>
		</main>
	);
}
