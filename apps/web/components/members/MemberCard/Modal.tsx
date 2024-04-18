"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Icons
import ChessIcon from "@/public/logos/chess.svg";
import ExternalLinkIcon from "@/public/icons/external_link.svg";
import ArrowRightIcon from "@/public/icons/arrow_right.svg";

import SinceIcon from "@/public/icons/since.svg";
import EmailIcon from "@/public/icons/email.svg";
import HourIcon from "@/public/icons/hour.svg";

import ManageAccountIcon from "@/public/icons/manage_account.svg";

// Components
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Slot } from "@radix-ui/react-slot";

export function MemberCard({ id: memberId }: { id: string }) {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();

	return (
		<Dialog open={isOpen}>
			<DialogContent
				className="gap-6 sm:max-w-[600px]"
				// hasCloseButton={false}
				onOverlayClick={() => {
					setIsOpen(false);

					setTimeout(() => {
						router.back();
					}, 100);
				}}
			>
				<DialogHeader className="flex flex-col items-center justify-start gap-6">
					<Image
						src={"https://github.com/theduardomaciel.png"}
						alt="Eduardo Maciel"
						className="overflow-hidden rounded-2xl"
						width={128}
						height={128}
					/>
					<div className="flex flex-col items-center justify-start gap-1">
						<DialogTitle>Eduardo Maciel</DialogTitle>
						<DialogDescription>#22210633</DialogDescription>
					</div>
				</DialogHeader>
				<div className="flex flex-col items-center justify-center gap-6">
					<ul className="flex flex-col flex-wrap items-center justify-center gap-2 sm:max-w-[70%] sm:flex-row">
						<InfoItem
							title="Membro desde 2024.1"
							icon={<SinceIcon />}
						/>
						<InfoItem
							title="ema2@ic.ufal.br"
							icon={<EmailIcon />}
						/>
						<InfoItem title="40 horas totais" icon={<HourIcon />} />
					</ul>
					<ul className="flex w-full flex-col items-center justify-start gap-2">
						<ActionItem asChild>
							<a href={`https://chess.com/member/${memberId}`}>
								<ChessIcon />
								<ExternalLinkIcon width={14} height={14} />
							</a>
						</ActionItem>
						<ActionItem asChild>
							<Link href={`/members/${memberId}/edit`}>
								Visualizar eventos presenciados
								<ArrowRightIcon />
							</Link>
						</ActionItem>
					</ul>
				</div>
				<DialogFooter>
					<Button type="submit" className="w-full" asChild>
						<Link href={`/auth`}>
							<ManageAccountIcon width={24} height={24} />
							Gerenciar minha conta
						</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
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
}: {
	children: React.ReactNode;
	asChild?: boolean;
}) {
	const Comp = asChild ? Slot : "li";

	return (
		<Comp className="flex w-full flex-row  items-center justify-between gap-2.5 rounded-lg bg-gray-500 p-4">
			{children}
		</Comp>
	);
}
