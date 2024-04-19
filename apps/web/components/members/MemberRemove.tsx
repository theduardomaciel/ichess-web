"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Icons
import BlockIcon from "@/public/icons/block.svg";

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

// Utils
import { useToast } from "@/hooks/use-toast";

// Types
import type { RouterOutput } from "@ichess/api";
import { trpc } from "@/lib/trpc/react";
type Member = RouterOutput["getEvent"]["event"]["membersOnEvent"][0];

interface Props {
	member: {
		id: Member["id"];
		name: Member["user"]["name"];
		role: Member["role"];
	};
	eventId: string;
}

export function MemberRemove({ member, eventId }: Props) {
	const router = useRouter();
	const { toast } = useToast();

	const [isOpen, setIsOpen] = useState(false);

	const [hasStartedMutation, setHasStartedMutation] = useState(false);
	const [isMutating, startTransition] = useTransition();

	const mutate = trpc.updateEventMembers.useMutation();

	async function removeMember() {
		try {
			startTransition(async () => {
				await mutate.mutateAsync({
					eventId,
					membersIdsToMutate: [member.id],
				});
				setHasStartedMutation(true);
				router.refresh();
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Erro ao remover membro",
				description: "Não foi possível remover o membro do evento.",
				variant: "error",
			});
		}
	}

	const isAdmin = member.role === "admin";

	useEffect(() => {
		if (isMutating === false && hasStartedMutation) {
			setIsOpen(false);

			toast({
				title: `${isAdmin ? "Moderador" : "Membro"} removido!`,
				description: `A presença de ${member.name} foi removida do evento.`,
				variant: "success",
			});
		}
	}, [hasStartedMutation, isMutating, toast, member.name, isAdmin]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button title="Remover presença do membro">
					<BlockIcon className="h-6 w-6" />
				</button>
			</DialogTrigger>
			<DialogContent
				className="w-full sm:max-w-lg"
				variant="compact"
				hasCloseButton={false}
			>
				<DialogHeader>
					<DialogTitle>
						Remover {isAdmin ? "moderador" : "participante"}
					</DialogTitle>
					<DialogDescription>
						Você tem certeza que deseja remover{" "}
						{!isAdmin ? "a presença de " : ""}
						<strong className="scale-105 text-nowrap text-neutral">
							{member.name}
						</strong>{" "}
						{isAdmin && <>da moderação </>}
						do evento? <br />
						{!isAdmin && (
							<>As horas atribuídas a ele serão removidas.</>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full gap-2 sm:justify-start">
					<DialogClose asChild>
						<Button
							className="w-full"
							type="button"
							size={"default"}
							variant="secondary"
							disabled={isMutating}
						>
							Cancelar
						</Button>
					</DialogClose>
					<Button
						className="w-full"
						size={"default"}
						variant={"destructive"}
						type="button"
						isLoading={isMutating}
						onClick={removeMember}
					>
						<BlockIcon className="h-6 w-6" />
						Remover
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
