"use client";

import type React from "react";
import Link from "next/link";
import { DotLottiePlayer } from "@lottiefiles/dotlottie-react";

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
import ErrorFaceIcon from "@/public/icons/error_face.svg";

interface Props {
	isOpen: boolean;
	onClose?: () => void;
	title?: string;
	description?: React.ReactNode;
}

interface LoadingDialogProps extends Props { }

export function LoadingDialog({
	isOpen,
	title,
	description,
}: LoadingDialogProps) {
	return (
		<Dialog open={isOpen}>
			<DialogContent
				className="flex flex-col items-center justify-center pb-16 sm:max-w-[450px]"
				hasCloseButton={false}
				onInteractOutside={(event) => {
					event.preventDefault();
				}}
				onEscapeKeyDown={(event) => {
					event.preventDefault();
				}}
			>
				<DialogHeader>
					<DotLottiePlayer src="/animations/loading.lottie" autoplay loop />
					<DialogTitle className="text-center font-title text-2xl font-extrabold">
						{title || "Estamos quase lá!"}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="max-w-[80%] text-center text-lg font-medium">
					{description || "Aguarde um pouquinho enquanto processamos tudo!"}
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}

interface SuccessDialogProps extends Props {
	href?: string;
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
				onEscapeKeyDown={(event) => {
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
							O processo foi concluído com sucesso! <br />
							Agora você pode continuar navegando na plataforma.
						</>
					)}
				</DialogDescription>
				<DialogFooter>
					<Link href={href ?? "/"} prefetch={false}>
						<Button type="button" className="h-11 px-6">
							{buttonText || "Entendi!"}
						</Button>
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function ErrorDialog({ isOpen, onClose, title, description }: Props) {
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
					<ErrorFaceIcon width={56} height={56} />
					<DialogTitle className="text-center font-title text-2xl font-extrabold">
						{title || "Ops! Algo deu errado!"}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="max-w-[80%] text-center text-lg font-medium">
					{description || (
						<>
							Algo deu errado ao enviar seu cadastro. <br />
							Por favor, tente novamente mais tarde.
						</>
					)}
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
