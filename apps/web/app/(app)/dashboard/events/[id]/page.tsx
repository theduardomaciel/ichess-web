import Link from "next/link";
import { Suspense } from "react";

import { cn, getDateString, getTimeString } from "@/lib/utils";

// Icons
import EditIcon from "@/public/icons/edit.svg";

// Components
import { Button } from "@/components/ui/button";
import { AceCard } from "@/components/dashboard/AceCard";
import { MemberAdd } from "@/components/members/MemberAdd";
import { DateDisplay } from "@/components/ui/calendar";
import { CodeGenerator } from "@/components/dashboard/CodeGenerator";
import { MemberPreview } from "@/components/members/MemberPreview";
import { EventDelete } from "@/components/events/EventDelete";
import { PagesDisplay } from "@/components/Pagination";
import { ShareDialog } from "@/components/dashboard/ShareDialog";

// Validation
import { z } from "zod";

// API
import { env } from "@ichess/env";
import { serverClient } from "@/lib/trpc/server";
import type { RouterOutput } from "@ichess/api";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SortBy } from "@/components/dashboard/SortBy";

const eventDetailsPageParams = z.object({
	id: z.string(),
});

const eventDetailsPageSearchParams = z.object({
	page: z.coerce.number().default(0),
	pageSize: z.coerce.number().default(5),
	search: z.string().optional(),
	general_search: z.string().optional(),
	sortBy: z.enum(["recent", "oldest"]).optional(),
	r: z.string().optional(),
});

type EventDetailsPageParams = z.infer<typeof eventDetailsPageParams>;
type EventDetailsPageSearchParams = z.infer<typeof eventDetailsPageSearchParams>;

export default async function EventPage(
	props: {
		params: Promise<EventDetailsPageParams>;
		searchParams: Promise<EventDetailsPageSearchParams>;
	}
) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const { id } = eventDetailsPageParams.parse(params);
	const { page, pageSize, search, general_search, r, sortBy } = eventDetailsPageSearchParams.parse(searchParams);

	const { event, members, pageCount } = await serverClient.getEvent({
		eventId: id,
		page: page || 1,
		pageSize: pageSize || 5,
		search: general_search,
		projectId: env.PROJECT_ID,
		sortBy: sortBy,
	});

	const dateString = getDateString(event);
	const timeFrom = getTimeString(event.dateFrom);
	const timeTo = getTimeString(event.dateTo);

	return (
		<main className="flex min-h-screen flex-col items-start justify-start gap-12 px-wrapper py-12">
			<div className="flex w-full flex-col items-start justify-start gap-4">
				<div className="flex w-full flex-row flex-wrap items-start justify-between gap-4">
					<h1 className="max-w-full font-title text-5xl font-extrabold text-neutral md:text-6xl lg:max-w-[60%]">
						{event.name}
					</h1>
					<span className="text-base font-semibold text-foreground opacity-50">
						#{event.id.split("-")[0]}
					</span>
				</div>
				<div className="flex flex-row items-center justify-start gap-4">
					<DateDisplay dateString={dateString} />
					<div className="h-1 w-1 rounded-full bg-neutral" />
					<p className="text-base font-medium">
						de {timeFrom} às {timeTo}
					</p>
				</div>
				<h2 className="text-base font-semibold leading-normal text-neutral">
					{event.description}
				</h2>
			</div>
			<div className="flex w-full flex-col items-center justify-start gap-4 md:flex-row">
				<div className="flex w-full flex-col items-start justify-start gap-4 sm:flex-row sm:gap-9">
					<SearchBar word={"general_search"} key={r} placeholder="Pesquisar membros credenciados" />
					<div className="flex flex-row items-center justify-between gap-4 max-sm:w-full sm:justify-end">
						<span className="text-nowrap text-sm font-medium">Ordenar por</span>
						<SortBy sortBy={sortBy} />
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col items-start justify-start gap-12 md:flex-row">
				<div className="flex w-full flex-col items-center justify-start gap-4 md:w-3/5">
					<MembersList
						members={members.filter((member) => member && member.role === "member")}
						eventId={event.id}
					/>
					{members && members.length > 0 && (
						<Suspense fallback={null}>
							<PagesDisplay currentPage={page || 1} pageCount={pageCount} />
						</Suspense>
					)}
					<div className="flex flex-col items-center justify-start xs:flex-row xs:justify-between w-full gap-4">
						<MemberAdd
							projectId={env.PROJECT_ID}
							eventId={event.id}
							alreadyAddedMembers={members.map((member) => member!.id)}
							search={searchParams.search}
							eventName={event.name.split(" ")[1]}
						/>
						<ShareDialog
							url={`https://ichess-web.vercel.app:3000/events/presence/${event.id}`}
						/>
					</div>
				</div>
				<MembersList
					className="md:w-2/5"
					members={event.membersOnEvent.filter((t) => t.member.role === "admin").map((t) => t.member)}
					eventId={event.id}
					isModerators
				/>
			</div>
		</main>
	);
}

interface MembersListProps {
	className?: string;
	isModerators?: boolean;
	eventId: string;
	members: RouterOutput["getEvent"]["members"];
}

function MembersList({
	className,
	isModerators = false,
	eventId,
	members,
}: MembersListProps) {
	return (
		<div
			className={cn(
				"flex w-full flex-col items-start justify-start gap-4",
				className,
			)}
		>
			<h2 className="font-title text-lg font-extrabold text-neutral">
				{isModerators ? "Responsáveis" : "Membros"}
			</h2>
			{members && members.length > 0 && (
				<ul className="flex w-full flex-col items-start justify-start gap-4">
					{members.map((member) => (
						<MemberPreview
							key={member.id}
							member={member}
							memberCardHref={`/dashboard/events/${eventId}/member/${member.id}`}
							event={{
								id: eventId,
								memberJoinedAt: member.joinedAt,
							}}
						/>
					))}
				</ul>
			)}
		</div>
	);
}
