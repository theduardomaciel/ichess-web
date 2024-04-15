import Image from "next/image";

import { cn, isDateDifferent } from "@/lib/utils";

// Icons
import PersonCheckIcon from "@/public/icons/person_check.svg";
import EditIcon from "@/public/icons/edit.svg";
import AccountIcon from "@/public/icons/account.svg";
import BlockIcon from "@/public/icons/block.svg";

// Components
import { Button } from "@/components/ui/button";
import { AceCard } from "@/components/dashboard/AceCard";
import { AddParticipant } from "@/components/dashboard/AddParticipant";
import { DateDisplay } from "@/components/ui/calendar";
import { CodeGenerator } from "@/components/dashboard/CodeGenerator";

// Data
import { env } from "@ichess/env";
import { z } from "zod";

// API
import { serverClient } from "@/lib/trpc/server";
import type { RouterOutput } from "@ichess/api";

const eventDetailsPageParams = z.object({
	id: z.string(),
});

type EventDetailsPageParams = z.infer<typeof eventDetailsPageParams>;

export default async function EventPage({
	params,
}: {
	params: EventDetailsPageParams;
}) {
	const { id } = eventDetailsPageParams.parse(params);

	const { event } = await serverClient.getEvent({
		eventId: id,
		projectId: env.PROJECT_ID,
	});

	const dateString = `${event.dateFrom.toLocaleDateString("pt-BR", {
		month: "2-digit",
		day: "2-digit",
		year: event.dateTo ? undefined : "numeric",
	})}${
		isDateDifferent(event.dateFrom, event.dateTo)
			? ` - ${event.dateTo.toLocaleDateString("pt-BR", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				})}`
			: ""
	}`;

	const timeFrom = event.dateFrom.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const timeTo = event.dateTo.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	});

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
						{timeFrom} às {timeTo}
					</p>
				</div>
				<h2 className="text-base font-semibold leading-normal text-neutral">
					{event.description}
				</h2>
			</div>
			<div className="flex w-full flex-col items-center justify-start gap-4 md:flex-row">
				<AceCard className="w-full" ace={event.ace} />
				<div className="flex flex-row items-center justify-between gap-4 max-sm:w-full">
					<Button
						size={"icon"}
						className="bg-info-100 ring-info-200 hover:bg-info-200"
					>
						<EditIcon className="h-5 w-5" />
					</Button>
					<CodeGenerator />
				</div>
			</div>
			<div className="flex w-full flex-col items-start justify-start gap-12 md:flex-row">
				<div className="flex w-full flex-col items-center justify-start gap-4 md:w-3/5">
					<MembersList
						members={event.membersOnEvent.filter(
							(member) => member.role === "member",
						)}
					/>
					<AddParticipant members={event.membersOnEvent} />
				</div>
				<MembersList
					className="md:w-2/5"
					members={event.membersOnEvent.filter(
						(member) => member.role === "admin",
					)}
					isResponsible
				/>
			</div>
		</main>
	);
}

interface MembersListProps {
	className?: string;
	isResponsible?: boolean;
	members: RouterOutput["getEvent"]["event"]["membersOnEvent"];
	onRemove?: (id: string) => void;
	onAdd?: () => void;
	onEdit?: (id: string) => void;
}

function MembersList({
	className,
	isResponsible = false,
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
				{isResponsible ? "Responsáveis" : "Membros"}
			</h2>
			<ul className="flex w-full flex-col items-start justify-start gap-4">
				{members.map((member) => (
					<MemberCard key={member.id} member={member} />
				))}
			</ul>
		</div>
	);
}

interface MemberCardProps {
	className?: string;
	member: RouterOutput["getEvent"]["event"]["membersOnEvent"][0];
}

function MemberCard({ className, member }: MemberCardProps) {
	return (
		<li
			className={cn(
				"flex w-full flex-col items-start justify-start gap-4 rounded-lg border bg-gray-300 px-6 py-4",
				className,
			)}
		>
			<div className="flex flex-row items-center justify-start gap-4">
				<Image
					src={member.user.image ?? ""}
					width={42}
					height={42}
					alt="Member profile picture"
					className="rounded-full"
				/>
				<div className="flex flex-col items-start justify-start">
					<h3 className="text-left text-base font-bold">
						{member.user.name ?? member.username}
					</h3>
					<p className="text-xs font-semibold text-foreground opacity-50">
						#{member.id.split("-")[0]}
					</p>
				</div>
			</div>
			<div className="flex w-full flex-row items-center justify-between gap-4">
				<div className="flex flex-row items-center justify-start gap-4 text-foreground">
					{!member.role && (
						<PersonCheckIcon className="h-4 min-h-4 w-4 min-w-4 md:min-h-4 md:min-w-4" />
					)}
					<p className="text-left text-sm font-medium leading-tight">
						{member.role === "admin"
							? "Moderador"
							: "Marcou presença às 14:35"}
					</p>
				</div>
				<div className="flex flex-row items-center justify-end gap-2 md:gap-4">
					<button title="Exibir cartão da conta do membro">
						<AccountIcon className="h-6 w-6" />
					</button>

					{member.role === "member" && (
						<button title="Remover presença do membro">
							<BlockIcon className="h-6 w-6" />
						</button>
					)}
				</div>
			</div>
		</li>
	);
}
