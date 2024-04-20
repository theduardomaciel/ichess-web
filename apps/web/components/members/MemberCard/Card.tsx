import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// Icons
import ChessIcon from "@/public/logos/chess.svg";
import ExternalLinkIcon from "@/public/icons/external_link.svg";
import ArrowRightIcon from "@/public/icons/arrow_right.svg";

import SinceIcon from "@/public/icons/since.svg";
import EmailIcon from "@/public/icons/email.svg";
import HourIcon from "@/public/icons/hour.svg";

import ManageAccountIcon from "@/public/icons/manage_account.svg";

// Components
import { Slot } from "@radix-ui/react-slot";
import { Button } from "@/components/ui/button";
import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { MemberCardSkeleton } from "./Skeleton";
import { serverClient } from "@/lib/trpc/server";
import { cn } from "@/lib/utils";

interface Props {
	id: string;
	variant?: "brighter";
}

export async function MemberCard({ id: memberId, variant }: Props) {
	const { member, period, hours, requestClientRole } =
		await serverClient.getMember({
			memberId,
		});

	return (
		<Suspense fallback={<MemberCardSkeleton />}>
			<DialogHeader className="flex flex-col items-center justify-start gap-6">
				<Image
					src={member.user.image || "https://github.com/juquinha.png"}
					alt={member.user.name || "User profile image"}
					className="overflow-hidden rounded-2xl"
					width={128}
					height={128}
				/>
				<div className="flex flex-col items-center justify-start gap-1">
					<DialogTitle>{member.user.name}</DialogTitle>
					<DialogDescription>
						#{member.id.split("-")[0]}
					</DialogDescription>
				</div>
			</DialogHeader>
			<div className="flex flex-col items-center justify-center gap-6">
				<ul className="flex flex-col flex-wrap items-center justify-center gap-2 sm:max-w-[70%] sm:flex-row">
					<InfoItem
						title={`${member.role === "member" ? "Membro" : "Moderador"} desde ${period || new Date().getFullYear()}`}
						icon={<SinceIcon />}
					/>
					<InfoItem title={member.user.email} icon={<EmailIcon />} />
					<InfoItem
						title={`${hours} horas totais`}
						icon={<HourIcon />}
					/>
				</ul>
				<ul className="flex w-full flex-col items-center justify-start gap-2">
					<ActionItem variant={variant} asChild>
						<a
							href={`https://chess.com/member/${member.username}`}
							target="_blank"
						>
							<div className="hidden flex-row items-center justify-start gap-2 lg:flex">
								<span className="text-base font-semibold">
									{member.username ||
										"Usuário não encontrado"}
								</span>
								<ExternalLinkIcon width={14} height={14} />
							</div>
							<ChessIcon />
							<ExternalLinkIcon
								width={14}
								height={14}
								className="flex lg:hidden"
							/>
						</a>
					</ActionItem>
					<ActionItem variant={variant} asChild>
						<Link href={`/events/${memberId}`}>
							Visualizar eventos presenciados
							<ArrowRightIcon />
						</Link>
					</ActionItem>
				</ul>
			</div>
			<DialogFooter>
				{requestClientRole === "admin" ? (
					<Button variant={"destructive"} className="w-full" asChild>
						<Link href={`/auth`} className="w-full">
							Remover membro
						</Link>
					</Button>
				) : (
					<Button className="w-full" asChild>
						<Link href={`/auth`} className="w-full">
							<ManageAccountIcon width={24} height={24} />
							Gerenciar minha conta
						</Link>
					</Button>
				)}
			</DialogFooter>
		</Suspense>
	);
}

function InfoItem({ title, icon }: { title: string; icon: React.ReactNode }) {
	return (
		<li className="flex flex-row items-center justify-center gap-2">
			{icon}
			{title}
		</li>
	);
}

function ActionItem({
	children,
	asChild,
	variant,
}: {
	children: React.ReactNode;
	asChild?: boolean;
	variant?: "brighter";
}) {
	const Comp = asChild ? Slot : "li";

	return (
		<Comp
			className={cn(
				"flex w-full flex-row items-center justify-between gap-2.5 rounded-lg bg-gray-500 p-4 transition-colors hover:bg-gray-600",
				{
					"bg-gray-400 hover:bg-gray-500": variant === "brighter",
				},
			)}
		>
			{children}
		</Comp>
	);
}
