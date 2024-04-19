import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

// Icons
import AccountIcon from "@/public/icons/account.svg";
import PersonCheckIcon from "@/public/icons/person_check.svg";

// API
import type { RouterOutput } from "@ichess/api";
import { MemberRemove } from "./MemberRemove";

interface MemberPreviewProps {
	className?: string;
	eventId: string;
	member: RouterOutput["getEvent"]["event"]["membersOnEvent"][0];
}

export function MemberPreview({
	className,
	eventId,
	member,
}: MemberPreviewProps) {
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
					<Link
						title="Exibir cartão da conta do membro"
						href={`/dashboard/events/${eventId}/member/${member.id}`}
						scroll={false}
					>
						<AccountIcon className="h-6 w-6" />
					</Link>

					{member.role === "member" && (
						<MemberRemove
							memberName={member.user.name}
							eventId={eventId}
							memberId={member.id}
						/>
					)}
				</div>
			</div>
		</li>
	);
}
