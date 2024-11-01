"use client";

import Image from "next/image";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Icons
import { Loader2 } from "lucide-react";
import AddIcon from "@/public/icons/add.svg";

// Components
import { Button } from "@/components/ui/button";
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
// import type { RouterOutput } from "@ichess/api";
import { trpc } from "@/lib/trpc/react";

interface AddParticipantProps {
	projectId: string;
	eventId: string;
	alreadyAddedMembers: string[];
	search?: string;
	eventName: string;
}

export function MemberAdd({
	projectId,
	eventId,
	alreadyAddedMembers,
	search,
	eventName,
}: AddParticipantProps) {
	const router = useRouter();
	const { toast } = useToast();
	const currentDate = new Date();

	const [isOpen, setIsOpen] = useState(false);

	const [addedUsersAmount, setAddedUsersAmount] = useState<number | undefined>(
		undefined,
	);
	const [isMutating, startTransition] = useTransition();

	const mutations = trpc.updateEventMembers.useMutation();
	const { data, isFetching } = trpc.getMembers.useQuery({
		projectId,
		pageSize: 1000,
	});

	const members = data?.members.filter(
		(member) => !alreadyAddedMembers.includes(member.id),
	);

	const filteredMembers = search
		? members?.filter(
			(member) =>
				member.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
				member.username.toLowerCase().includes(search.toLowerCase()),
		)
		: members;

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const selectedMembers = Array.from(formData.keys()).filter(
			(key) => formData.get(key) === "on",
		);

		console.log("Membros selecionados: ", selectedMembers);

		if (selectedMembers.length === 0) {
			toast({
				title: "Nenhum participante selecionado",
				description: "Selecione ao menos um participante para adicionar.",
				variant: "warning",
			});
			return;
		}

		startTransition(async () => {
			try {
				const promise = await Promise.all(
					selectedMembers.map(async (memberId) => {
						const userId = members?.find((member) => member.id === memberId)?.userId as string
						console.log(userId, eventName)
						const response = await fetch("https://secomp.pythonanywhere.com/subscribe/confirm/", {
							method: 'POST',
							body: JSON.stringify({
								participant_id: userId,
								day: eventName
							}),
						})
						const data = await response.json()
						console.log(data)
					}
					),
				)

				await Promise.all(promise)

				await mutations.mutateAsync({
					eventId,
					membersIdsToMutate: selectedMembers,
				});

				setAddedUsersAmount(selectedMembers.length);
			} catch (error) {
				console.error(error);
				toast({
					title: "Erro ao carregar para nuvem!",
					description:
						"Ocorreu um erro ao adicionar o participante. Tente novamente mais tarde.",
					variant: "error",
				});
			}

			router.refresh();
		});
	}

	useEffect(() => {
		if (isMutating === false && addedUsersAmount) {
			setIsOpen(false);

			const title =
				addedUsersAmount > 1
					? "Participantes adicionados!"
					: "Participante adicionado!";
			const description =
				addedUsersAmount > 1
					? "Os participantes foram adicionados com sucesso."
					: "O participante foi adicionado com sucesso.";

			toast({
				title,
				description,
				variant: "success",
			});
		}
	}, [isMutating, addedUsersAmount, toast]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={"lg"} className="w-full">
					Adicionar participante
					<AddIcon className="h-6 w-6" />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full sm:max-w-lg" hasCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Adicionar participante</DialogTitle>
					<DialogDescription>
						{currentDate.toLocaleString("pt-BR", {
							weekday: "long",
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={onSubmit}
					className="flex flex-col items-start justify-start gap-4"
				>
					<div className="flex w-full flex-col items-center justify-start gap-4">
						<SearchBar
							className="w-full bg-gray-200"
							placeholder="Pesquisar membros"
						/>
						{filteredMembers && filteredMembers.length > 0 ? (
							<div className="no-scrollbar max-h-[32.5vh] w-full overflow-y-scroll lg:max-h-[40vh]">
								<ul className="flex h-full w-full flex-col items-start justify-start gap-4">
									{filteredMembers.map((member, i) => (
										<li
											key={member.id}
											className="flex w-full flex-row items-center justify-between"
										>
											<div className="flex flex-row items-center justify-start gap-4">
												<Image
													src={
														member.user?.image ??
														"https://github.com/marquinhos.png"
													}
													width={36}
													height={36}
													className="rounded-full"
													alt="Member profile picture"
												/>
												<span className="text-left text-base font-semibold leading-tight text-neutral">
													{member.user?.name ?? `@${member.username}`}
												</span>
											</div>
											<div className="flex flex-row items-center justify-end gap-4">
												{member.user?.name && (
													<span className="hidden text-xs font-semibold leading-none text-neutral opacity-50 md:flex lowercase">
														{member.username}
													</span>
												)}
												<Checkbox
													id={member.id}
													name={member.id}
													className="h-6 w-6"
												/>
											</div>
										</li>
									))}
								</ul>
							</div>
						) : isFetching ? (
							<Loader2 className="origin-center animate-spin" />
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
								disabled={isMutating}
							>
								Voltar
							</Button>
						</DialogClose>
						<Button
							className="w-full md:h-12"
							size={"lg"}
							type="submit"
							isLoading={isMutating}
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
