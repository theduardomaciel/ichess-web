"use client";

import Link from "next/link";

// Components
import BoardTilt from "@/components/Board";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/forms";

// Icons
import Logo from "@/public/logo.svg";
import ReloadIcon from "@/public/icons/reload.svg";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="relative z-10 flex h-screen flex-col items-center justify-start overflow-hidden lg:flex-row lg:justify-between">
			<BoardTilt />
			<div className="order-1 flex flex-col items-start justify-start gap-12 px-9 lg:order-3 lg:px-0">
				<div className="flex flex-col items-start justify-start gap-8">
					<div className="flex flex-col items-start justify-start">
						<h1 className="font-title text-3xl font-black leading-tight text-neutral">
							Parece que suas jogadas foram longe demais...
						</h1>
						<p className="max-w-[80%] text-xl font-medium text-neutral">
							Um erro inesperado ocorreu durante a execução da sua jogada.
							Envie-o para o time de desenvolvimento para que possamos
							resolvê-lo.
						</p>
					</div>
					<div className="max-w-[75%]">
						<Panel type="error">{error.message || error.digest}</Panel>
					</div>
				</div>
				<Button className="h-12 gap-4 px-9" onClick={() => reset()}>
					<ReloadIcon />
					Tentar novamente
				</Button>
			</div>
			<div className="order-4 hidden h-full flex-col items-center justify-end border-l-2 border-primary-200/20 bg-gray-400 p-4 lg:flex">
				<Link href="/">
					<Logo />
				</Link>
			</div>
		</div>
	);
}
