import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

// Icons
import SinceIcon from "@/public/icons/since.svg";
import AccountIcon from "@/public/icons/account.svg";
import PersonCheckIcon from "@/public/icons/person_check.svg";

// Icons
import ChessIcon from "@/public/logos/chess.svg";
import ExternalLinkIcon from "@/public/icons/external_link.svg";

// API
import type { RouterOutput } from "@ichess/api";
import { MemberRemove } from "./MemberRemove";
import { Skeleton } from "../ui/skeleton";

interface Props {
	className?: string;
	memberCardHref: string;
	event?: {
		id: string;
		memberJoinedAt: Date;
	};
	member: RouterOutput["getMembers"]["members"][number];
}

export function MemberPreview({
	className,
	event,
	memberCardHref,
	member,
}: Props) {
	return (
		<li
			className={cn(
				"flex w-full flex-col items-start justify-start gap-4 rounded-lg border bg-gray-300 px-6 py-4",
				className,
			)}
		>
			<div className="flex flex-row items-center justify-start gap-4">
				<Image
					src={member.user?.image ?? ""}
					width={42}
					height={42}
					alt="Member profile picture"
					className="rounded-full"
				/>
				<div className="flex flex-col items-start justify-start">
					<h3 className="text-left text-base font-bold">
						{member.user?.name ?? member.username}
					</h3>
					<p className="text-xs font-semibold text-foreground opacity-50">
						#{member.id.split("-")[0]}
					</p>
				</div>
			</div>
			<div className="flex w-full flex-row items-center justify-between gap-4">
				{event ? (
					<div className="flex flex-row items-center justify-start gap-4 text-foreground">
						{member.role === "member" && (
							<PersonCheckIcon className="h-4 min-h-4 w-4 min-w-4 md:min-h-4 md:min-w-4" />
						)}
						<p className="text-left text-sm font-medium leading-tight">
							{member.role === "admin"
								? "Moderador"
								: `Marcou presença às ${event?.memberJoinedAt.toLocaleTimeString(
									"pt-BR",
									{
										hour: "2-digit",
										minute: "2-digit",
									},
								)}`}
						</p>
					</div>
				) : (
					<div className="flex flex-row items-center justify-start gap-3 text-left text-sm font-medium leading-tight">
						{member.role === "admin" ? "Moderador" : "Membro"}
						<div className="h-1 w-1 rounded-full bg-neutral" />
						<span className="lowercase">{member.username}</span>
					</div>
				)}
			</div>
		</li>
	);
}

interface GuestProps {
	className?: Props["className"];
	member: Props["member"];
	periodSlug?: string;
	isMember?: boolean | null;
}

export function MemberGuestPreview({
	className,
	member,
	periodSlug,
	isMember,
}: GuestProps) {
	return (
		<a
			href={`https://chess.com/member/${member.username}`}
			target="_blank"
			rel="noreferrer"
		>
			<li
				className={cn(
					"content-stretch w-full items-center justify-between rounded-lg border border-primary-200/50 bg-gray-300 px-8 py-4 transition-colors hover:bg-gray-200",
					className,
				)}
			>
				<div className="flex flex-row items-center justify-start gap-4">
					<Image
						src={member.user?.image ?? ""}
						width={42}
						height={42}
						alt="Member profile picture"
						className="rounded-full"
					/>
					<div className="flex flex-col items-start justify-start">
						<div className="flex flex-row items-center justify-start gap-0 md:gap-2">
							<h3 className="text-left text-base font-bold">
								{isMember ? member.user?.name : member.username}
							</h3>
							{isMember && (
								<span className="text-xs font-medium text-foreground opacity-50">
									@{member.username}
								</span>
							)}
						</div>
						{periodSlug ? (
							<div className="flex flex-row items-center justify-start gap-2">
								<SinceIcon className="h-4 w-4" />
								<p className="text-sm md:text-base">
									{member.role === "admin" ? "Moderador" : "Membro"} desde{" "}
									{periodSlug}
								</p>
							</div>
						) : (
							<Skeleton className="h-4 w-28" />
						)}
					</div>
				</div>
			</li>
		</a>
	);
}
