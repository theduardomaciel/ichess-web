"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Icons
import AccountIcon from "@/public/icons/account.svg";

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

// API
import { trpc } from "@/lib/trpc/react";

// Types
import type { RouterOutput } from "@ichess/api";
type Member = RouterOutput["getEvent"]["event"]["members"][number];

interface Props {
	member: {
		id: Member["id"];
		name: Member["user"]["name"];
		role: Member["role"];
	};
}

export function MemberPromote({ member }: Props) {
	const router = useRouter();
	const { toast } = useToast();

	const [isOpen, setIsOpen] = useState(false);

	const [hasStartedMutation, setHasStartedMutation] = useState(false);
	const [isMutating, startTransition] = useTransition();

	const mutate = trpc.updateMemberRole.useMutation();

	async function removeMember() {
		try {
			startTransition(async () => {
				await mutate.mutateAsync({
					memberId: member.id,
					role: "admin",
				});
				setHasStartedMutation(true);
				router.refresh();
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Erro ao promover membro",
				description: "Não foi possível promover o membro para moderador.",
				variant: "error",
			});
		}
	}

	const isAdmin = member.role === "admin";

	useEffect(() => {
		if (isMutating === false && hasStartedMutation) {
			setIsOpen(false);

			toast({
				title: `Membro promovido`,
				description: `O cargo de ${member.name} foi promovido a moderador.`,
				variant: "success",
			});
		}
	}, [hasStartedMutation, isMutating, toast, member.name, isAdmin]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button type="button" title="Promover membro">
					<AccountIcon className="h-6 w-6" />
				</button>
			</DialogTrigger>
			<DialogContent
				className="w-full sm:max-w-lg"
				variant="compact"
				onInteractOutside={(event) => {
					event.preventDefault();
				}}
				onEscapeKeyDown={(event) => {
					event.preventDefault();
				}}
				hasCloseButton={false}
			>
				<DialogHeader>
					<DialogTitle>
						Promover {isAdmin ? "moderador" : "participante"}
					</DialogTitle>
					<DialogDescription>
						Você tem certeza que deseja promover{" "}
						{!isAdmin ? "o cargo de " : ""}
						<strong className="scale-105 text-nowrap text-neutral">
							{member.name}
						</strong>?
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
						variant={"default"}
						type="button"
						isLoading={isMutating}
						onClick={removeMember}
					>
						<AccountIcon className="h-6 w-6" />
						Promover
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
