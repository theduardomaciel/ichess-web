"use client";

import { useState } from "react";

// Icons
import DeleteIcon from "@/public/icons/delete.svg";

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
import {
	ErrorDialog,
	LoadingDialog,
	SuccessDialog,
} from "@/components/forms/dialogs";
import { trpc } from "@/lib/trpc/react";

interface Props {
	eventId: string;
}

export function EventDelete({ eventId }: Props) {
	const [currentState, setCurrentState] = useState<
		boolean | "submitting" | "submitted" | "error"
	>(false);

	const mutation = trpc.deleteEvent.useMutation();

	async function deleteEvent() {
		setCurrentState("submitting");
		try {
			await mutation.mutateAsync({ eventId });
			setCurrentState("submitted");
		} catch (error) {
			setCurrentState("error");
		}
	}

	return (
		<>
			<Dialog open={currentState === true} onOpenChange={setCurrentState}>
				<DialogTrigger asChild>
					<Button
						size={"icon"}
						className="bg-tertiary-100 ring-tertiary-200 hover:bg-tertiary-200"
					>
						<DeleteIcon className="h-5 w-5" />
					</Button>
				</DialogTrigger>
				<DialogContent
					className="flex flex-col items-center justify-center sm:max-w-[450px]"
					hasCloseButton={false}
				>
					<DialogHeader className="flex flex-col items-center justify-center gap-4">
						<DeleteIcon width={56} height={56} />
						<DialogTitle className="text-center font-title text-2xl font-extrabold">
							Você tem certeza?
						</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						A exclusão do evento removerá todas as informações
						anexadas e reduzirá a quantidade de horas obtida pelos
						membros que participaram. <br /> Cuidado, pois essa ação
						não poderá ser desfeita.
					</DialogDescription>
					<DialogFooter className="w-full gap-2">
						<DialogClose asChild>
							<Button
								type="button"
								variant={"secondary"}
								className="h-12 w-full px-6"
							>
								Cancelar
							</Button>
						</DialogClose>
						<Button
							type="button"
							variant={"destructive"}
							className="h-12 w-full"
							onClick={deleteEvent}
						>
							Excluir
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<LoadingDialog isOpen={currentState === "submitting"} />
			<SuccessDialog
				isOpen={currentState === "submitted"}
				title="Evento excluído com sucesso!"
				href="/dashboard/events"
				description={
					<>
						O evento foi excluído com sucesso! <br />
						Você será redirecionado para a página inicial.
					</>
				}
			/>
			<ErrorDialog
				isOpen={currentState === "error"}
				title="Erro ao excluir evento"
				description={
					<>
						Algo deu errado ao tentar excluir o evento.
						<br /> Por favor, tente novamente. Caso o problema
						persista, entre em contato com a equipe de comunicação.
					</>
				}
			/>
		</>
	);
}
