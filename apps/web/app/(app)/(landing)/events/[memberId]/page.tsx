import { Suspense } from "react";
import type { Metadata } from "next";

// Icons
import ArrowRight from "@/public/icons/arrow_right.svg";

// Components
import { EventPreview } from "@/components/events/EventPreview";
import { PagesDisplay } from "@/components/Pagination";
import { Empty } from "@/components/Empty";
import { Hero } from "@/components/Hero";
import { Wrapper } from "@/components/Wrapper";

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
import { auth } from "@ichess/auth";
import { serverClient } from "@/lib/trpc/server";

export const metadata: Metadata = {
	title: "Eventos",
	description: "Veja todos os eventos cadastrados",
};

const eventsPageParams = getEventsParams.extend({
	r: z.string().optional(),
});

export type EventsPageParams = z.infer<typeof eventsPageParams>;

export default async function MemberEventsPage({
	params: { memberId },
	searchParams,
}: {
	params: {
		memberId: string;
	};
	searchParams: EventsPageParams;
}) {
	const session = await auth();

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
		memberId,
	});

	// O "r" equivale ao estado da barra de pesquisa quando o usuário clica em "Limpar filtros"
	// Isso é feito por meio da mudança de key do componente SearchBar

	return (
		<>
			<Hero
				title="Seus eventos"
				description="Acompanhe os eventos dos quais você participou e está participando"
				preTitle="2024.1"
				buttonProps={{
					href: "/events",
					title: "Voltar",
					icon: ArrowRight,
					iconClassName: "-scale-x-100",
				}}
			/>
			<Wrapper>
				<div className="flex flex-1 flex-col items-start justify-center gap-4">
					<div className="flex w-full flex-col items-start justify-start gap-4 sm:flex-row sm:gap-9">
						<SearchBar
							key={r}
							tag={
								session?.member?.username
									? `@${session?.member?.username}`
									: `#${memberId.split("-")[0]}`
							}
							placeholder="Pesquisar eventos"
						/>
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
									<EventPreview
										className="w-full"
										key={event.id}
										event={event}
									/>
								))
							) : (
								<Empty href={`/events/${memberId}`} />
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
					<PeriodFilter />
					<AceFilter />
					<ModeratorFilter projectId={env.PROJECT_ID} />
				</Filters>
			</Wrapper>
		</>
	);
}
