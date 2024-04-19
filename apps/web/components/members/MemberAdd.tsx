"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Icons
import AddIcon from "@/public/icons/add.svg";

// Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchBar } from "@/components/dashboard/SearchBar";

// Types
import type { RouterOutput } from "@ichess/api";

interface AddParticipantProps {
	members: RouterOutput["getEvent"]["event"]["membersOnEvent"];
}

export function MemberAdd({ members }: AddParticipantProps) {
	const [time, setTime] = useState(new Date());

	const search = useSearchParams().get("search");
	const filteredMembers = search
		? members?.filter(
				(member) =>
					member.user?.name
						?.toLowerCase()
						.includes(search.toLowerCase()) ||
					member.username
						.toLowerCase()
						.includes(search.toLowerCase()),
			)
		: members;

	useEffect(() => {
		// Timer to refresh codes every 1 second
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button type="button" size={"lg"} className="w-full">
					Adicionar participante
					<AddIcon className="h-6 w-6" />
				</Button>
			</DialogTrigger>
			<DialogContent
				className="w-full sm:max-w-lg"
				hasCloseButton={false}
			>
				<DialogHeader>
					<DialogTitle>Adicionar participante</DialogTitle>
					<DialogDescription>
						{time.toLocaleString("pt-BR", {
							weekday: "long",
							day: "numeric",
							month: "long",
							year: "numeric",
							/* hour: "numeric",
							minute: "numeric",
							second: "numeric", */
						})}
					</DialogDescription>
				</DialogHeader>
				<form
					action=""
					className="flex flex-col items-start justify-start gap-9"
				>
					<div className="flex w-full flex-col items-center justify-start gap-9">
						<SearchBar
							className="w-full bg-gray-200"
							placeholder="Pesquisar membros"
						/>
						{filteredMembers && filteredMembers.length > 0 ? (
							<ScrollArea className="max-h-[50vh] w-full">
								<ul className="flex h-full w-full flex-col items-start justify-start gap-4">
									{filteredMembers.map((member, i) => (
										<li
											key={i}
											className="flex w-full flex-row items-center justify-between"
										>
											<div className="flex flex-row items-center justify-start gap-4">
												<Image
													src={
														member.user.image ??
														"https://github.com/marquinhos.png"
													}
													width={36}
													height={36}
													className="rounded-full"
													alt="Member profile picture"
												/>
												<span className="text-left text-base font-semibold leading-tight text-neutral">
													{member.user.name ??
														`@${member.username}`}
												</span>
											</div>
											<div className="flex flex-row items-center justify-end gap-4">
												{member.user.name && (
													<span className="hidden text-xs font-semibold leading-none text-neutral opacity-50 md:flex">
														@{member.username}
													</span>
												)}
												<Checkbox
													id={`member-${i}`}
													name={`member-${i}`}
													className="h-6 w-6"
												/>
											</div>
										</li>
									))}
								</ul>
							</ScrollArea>
						) : (
							<p>Nenhum membro encontrado.</p>
						)}
					</div>
					<DialogFooter className="w-full gap-2 sm:justify-start">
						<DialogClose asChild>
							<Button
								className="w-full md:h-12"
								type="button"
								size={"lg"}
								variant="secondary"
							>
								Voltar
							</Button>
						</DialogClose>
						<Button
							className="w-full md:h-12"
							size={"lg"}
							type="button"
						>
							Adicionar
							<AddIcon className="h-6 w-6" />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
