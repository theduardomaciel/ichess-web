"use client";

import React from "react";
import Link from "next/link";
import { DotLottiePlayer } from "@dotlottie/react-player";

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
} from "@/components/ui/dialog";

// Icons
import SuccessIcon from "@/public/icons/success.svg";

interface Props {
	isOpen: boolean;
	onClose?: () => void;
}

export function LoadingDialog({ isOpen }: Props) {
	return (
		<Dialog open={isOpen}>
			<DialogContent
				className="flex flex-col items-center justify-center pb-16 sm:max-w-[450px]"
				hasCloseButton={false}
				onInteractOutside={(event) => {
					event.preventDefault();
				}}
			>
				<DialogHeader>
					<DotLottiePlayer
						src="/animations/loading.lottie"
						autoplay
						loop
					/>
					<DialogTitle className="text-center font-title text-2xl font-extrabold">
						Estamos realizando seu cadastro...
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="max-w-[80%] text-center text-lg font-medium">
					Aguarde um pouquinho enquanto processamos tudo!
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}

interface SuccessDialogProps extends Props {
	href?: string;
	title?: string;
	description?: React.ReactNode;
	buttonText?: string;
}

export function SuccessDialog({
	isOpen,
	href,
	title,
	description,
	buttonText,
}: SuccessDialogProps) {
	return (
		<Dialog open={isOpen}>
			<DialogContent
				className="flex flex-col items-center justify-center py-16 sm:max-w-[450px]"
				hasCloseButton={false}
				onInteractOutside={(event) => {
					event.preventDefault();
				}}
			>
				<DialogHeader className="flex flex-col items-center justify-center gap-4">
					<SuccessIcon />
					<DialogTitle className="text-center font-title text-2xl font-extrabold">
						{title || "Eba! Deu tudo certo!"}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="max-w-[80%] text-center text-lg font-medium">
					{description || (
						<>
							Seu cadastro já foi enviado e está em análise.
							<br />
							Uma resposta será enviada ao seu e-mail
							institucional em breve!
						</>
					)}
				</DialogDescription>
				<DialogFooter>
					<Link href={href ?? `/`}>
						<Button type="button" className="h-11 px-6">
							{buttonText || "Entendi!"}
						</Button>
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function ErrorDialog({ isOpen, onClose }: Props) {
	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					onClose?.();
				}
			}}
		>
			<DialogContent
				className="flex flex-col items-center justify-center py-16 sm:max-w-[450px]"
				hasCloseButton={false}
			>
				<DialogHeader className="flex flex-col items-center justify-center gap-4">
					<SuccessIcon />
					<DialogTitle className="text-center font-title text-2xl font-extrabold">
						Oops! Algo deu errado!
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="max-w-[80%] text-center text-lg font-medium">
					Algo deu errado ao enviar seu cadastro. <br />
					Por favor, tente novamente mais tarde.
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" className="h-11 px-6">
							Voltar
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Texto de 3 pontinhos que muda indicando carregamento
/* function LoadingDots() {
	const [dots, setDots] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev + 1) % 4);
		}, 300);
		return () => clearInterval(interval);
	}, []);

	return ".".repeat(dots);
} */
