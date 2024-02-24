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
import SearchBar from "@/components/dashboard/SearchBar";

interface AddParticipantProps {
	members: any[];
}

export function AddParticipant({ members }: AddParticipantProps) {
	const [time, setTime] = useState(new Date());

	const search = useSearchParams().get("search");
	const filteredMembers = search
		? members?.filter((member) =>
				member.name.toLowerCase().includes(search.toLowerCase())
		  )
		: members;

	useEffect(() => {
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
					<AddIcon className="w-6 h-6" />
				</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-lg w-full"
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
					<div className="flex flex-col items-center justify-start w-full gap-9">
						<SearchBar
							className="w-full bg-gray-200"
							placeholder="Pesquisar membros"
						/>
						{filteredMembers && filteredMembers.length > 0 ? (
							<ScrollArea className="w-full max-h-[50vh]">
								<ul className="flex flex-col items-start justify-start gap-4 w-full h-full">
									{members.map((member, i) => (
										<li
											key={i}
											className="flex flex-row items-center justify-between w-full"
										>
											<div className="flex flex-row items-center justify-start gap-4">
												<Image
													src={`https://github.com/marquinhos.png`}
													width={36}
													height={36}
													className="rounded-full"
													alt="Member profile picture"
												/>
												<span className="text-left text-neutral text-base font-semibold leading-tight">
													{member.name}
												</span>
											</div>
											<div className="flex flex-row items-center justify-end gap-4">
												<span className="opacity-50 text-neutral text-xs font-semibold leading-none hidden md:flex">
													@{member.username}
												</span>
												<Checkbox
													id={`member-${i}`}
													name={`member-${i}`}
													className="w-6 h-6"
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
					<DialogFooter className="sm:justify-start w-full gap-2">
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
							<AddIcon className="w-6 h-6" />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
