import type { Metadata } from "next";

import { cn } from "@/lib/utils";

// Icons
import PawnIcon from "@/public/icons/pawn.svg";

// Components
import { NoEvents } from "@/components/events/NoEvents";
import { Hero } from "@/components/Hero";
import { Wrapper } from "@/components/Wrapper";
import { StyledTitle } from "@/components/events/StyledTitle";
import { ExternalEvent } from "@/components/events/ExternalEvent";
import { NotLogged } from "@/components/auth/LoginStatus";
import { EventPreview } from "@/components/events/EventPreview";

// Carousel
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselControl,
	CarouselDotButtons,
} from "@/components/ui/carousel";

// Validation
import type { z } from "zod";
import type { getEventsParams } from "@ichess/api/routers/events";

// API
import { env } from "@ichess/env";
import { auth } from "@ichess/auth";
import { serverClient } from "@/lib/trpc/server";

export const metadata: Metadata = {
	title: "Eventos",
	description: "Veja os eventos de que você participou como membro",
};

export type EventsPageParams = z.infer<typeof getEventsParams>;

export default async function EventsPage() {
	const session = await auth();
	const isMember = session && !!session.member?.role;

	const { events } = await serverClient.getEvents({
		projectId: env.PROJECT_ID,
		page: 1,
		pageSize: 100,
	});

	const monthExternal = events.filter(
		(event) =>
			event.type === "external" &&
			event.dateFrom.getMonth() === new Date().getMonth() &&
			event.dateFrom.getFullYear() === new Date().getFullYear(),
	);

	const weekInterval = 7 * 24 * 60 * 60 * 1000;

	const thisWeekInternal = events.filter(
		(event) =>
			event.type === "internal" &&
			event.dateFrom.getTime() < Date.now() + weekInterval,
	);

	const nextWeekInternal = events.filter(
		(event) =>
			event.type === "internal" &&
			event.dateFrom.getTime() >= Date.now() + weekInterval,
	);

	return (
		<>
			<Hero
				title="Próximos eventos"
				description="Acompanhe os eventos seguintes do IChess, tanto internos,
				como externos, e saiba quando participar!"
				preTitle="2024.1"
				buttonProps={
					isMember
						? {
								href: `/events/${session?.member?.id}`,
								title: "Ver meus eventos",
								icon: PawnIcon,
							}
						: undefined
				}
			/>
			<Wrapper className="gap-16 !px-0 max-md:py-16 items-center">
				<StyledTitle title="Evento Externos" />

				<div className="flex w-full flex-col items-start justify-start gap-6">
					<h3 className="pl-wrapper font-title text-2xl font-bold">Este Mês</h3>
					{monthExternal.length > 0 ? (
						<div className="flex w-full flex-col items-center justify-start gap-4">
							<Carousel
								className="flex w-full flex-col"
								opts={{
									align: "center",
									loop: true,
								}}
							>
								<CarouselContent className="-ml-8">
									{monthExternal.map((event) => (
										<CarouselItem
											key={event.id}
											className="ml-[var(--wrapper)] basis-[calc(100%-var(--wrapper)*2)] pl-8"
										>
											<ExternalEvent event={event} />
										</CarouselItem>
									))}
								</CarouselContent>
								<div className="mt-4 flex w-full flex-col-reverse md:flex-row items-center md:justify-between gap-4 px-wrapper">
									<div className="flex flex-row items-center justify-start gap-4">
										<CarouselControl direction="prev" />
										<CarouselControl direction="next" />
									</div>

									<CarouselDotButtons />
								</div>
							</Carousel>
						</div>
					) : (
						<NoEvents className="ml-wrapper w-[calc(100%-var(--wrapper)*2)]" />
					)}
				</div>

				<StyledTitle title="Eventos Internos" />

				{!isMember ? (
					<NotLogged
						className="w-[calc(100%-var(--wrapper)*2)]"
						isAuthenticated={!!session}
						href="/join"
					>
						Para acessar os eventos internos você precisa ser membro integrante
						do IChess :( <br />
						Caso você não faça parte do IC, mas tem interesse, dê uma olhada nos
						eventos públicos acima!
					</NotLogged>
				) : null}

				<div
					className={cn(
						"flex w-full flex-col items-start justify-start gap-16 px-wrapper",
						{
							"pointer-events-none select-none opacity-50": !isMember,
						},
					)}
				>
					<div className="flex w-full flex-col items-start justify-start gap-6">
						<h3 className="text-start font-title text-2xl font-bold text-neutral">
							Esta Semana
						</h3>
						<div
							className={cn("flex w-full grid-cols-2 flex-col gap-4 md:grid", {
								"md:flex": !thisWeekInternal.length,
							})}
						>
							{thisWeekInternal.length ? (
								thisWeekInternal.map((event) => (
									<EventPreview
										className="cursor-default select-none"
										key={event.id}
										event={event}
										showModerators={false}
									/>
								))
							) : (
								<NoEvents />
							)}
						</div>
					</div>

					<div className="flex w-full flex-col items-start justify-start gap-6">
						<h3 className="text-start font-title text-2xl font-bold text-neutral">
							Próxima Semana
						</h3>
						<div className="flex w-full gap-4">
							{nextWeekInternal.length ? (
								nextWeekInternal.map((event) => (
									<EventPreview
										className="cursor-default select-none"
										key={event.id}
										event={event}
										showModerators={false}
									/>
								))
							) : (
								<NoEvents />
							)}
						</div>
					</div>
				</div>
			</Wrapper>
		</>
	);
}
