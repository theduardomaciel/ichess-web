"use client";

import { useEffect, useRef, useState, useTransition } from "react";
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
	memberName: Member["user"]["name"];
	memberId: Member["id"];
	eventId: string;
}

export function MemberRemove({ memberId, memberName, eventId }: Props) {
	const router = useRouter();
	const { toast } = useToast();

	const [isOpen, setIsOpen] = useState(false);
	const [isMutating, startTransition] = useTransition();

	const mutate = trpc.updateEventMembers.useMutation();

	async function removeMember() {
		startTransition(async () => {
			await mutate.mutateAsync({
				eventId,
				membersIdsToMutate: [memberId],
			});
			router.refresh();
		});

		// setIsOpen(false);
	}

	const hasFirstRendered = useRef(false);

	useEffect(() => {
		if (isMutating === false && hasFirstRendered.current) {
			setIsOpen(false);

			toast({
				title: "Membro removido!",
				description: `A presença de ${memberName} foi removida do evento.`,
				className: "border-primary-100",
			});
		}

		hasFirstRendered.current = true;
	}, [isMutating, toast, memberName]);

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
					<DialogTitle>Remover participante</DialogTitle>
					<DialogDescription>
						Você tem certeza que deseja remover a presença de{" "}
						<strong className="scale-105 text-nowrap text-neutral">
							{memberName}
						</strong>{" "}
						do evento? <br /> As horas atribuídas a ele serão
						removidas.
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
