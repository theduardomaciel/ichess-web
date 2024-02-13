import { useEffect, useState } from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";

// Components
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

// Icons
import SuccessIcon from "@/public/icons/success.svg";
import Link from "next/link";

interface Props {
	isOpen: boolean;
}

export function LoadingDialog({ isOpen }: Props) {
	return (
		<Dialog open={isOpen}>
			<DialogContent
				className="sm:max-w-[450px] flex flex-col items-center justify-center pb-16"
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
					<DialogTitle className="font-title font-extrabold text-2xl text-center">
						Estamos realizando seu cadastro...
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="text-center font-medium text-lg max-w-[80%]">
					Aguarde um pouquinho enquanto processamos tudo!
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}

export function SuccessDialog({ isOpen }: Props) {
	return (
		<Dialog open={isOpen}>
			<DialogContent
				className="sm:max-w-[450px] flex flex-col items-center justify-center py-16"
				hasCloseButton={false}
				onInteractOutside={(event) => {
					event.preventDefault();
				}}
			>
				<DialogHeader className="flex flex-col items-center justify-center gap-4">
					<SuccessIcon />
					<DialogTitle className="font-title font-extrabold text-2xl text-center">
						Eba! Deu tudo certo!
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="text-center font-medium text-lg max-w-[80%]">
					Seu cadastro já foi enviado e está em análise. <br />
					Uma resposta será enviada ao seu e-mail institucional em
					breve!
				</DialogDescription>
				<DialogFooter>
					<Link href={`/`}>
						<Button type="button" className="h-11 px-6">
							Entendi!
						</Button>
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Texto de 3 pontinhos que muda indicando carregamento
function LoadingDots() {
	const [dots, setDots] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev + 1) % 4);
		}, 300);
		return () => clearInterval(interval);
	}, []);

	return ".".repeat(dots);
}
