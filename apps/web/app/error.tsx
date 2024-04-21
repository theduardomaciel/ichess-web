"use client";

import Link from "next/link";
import { useState } from "react";

// Components
import BoardTilt from "@/components/Board";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/forms";

// Icons
import Logo from "@/public/logo.svg";
import ArrowRightIcon from "@/public/icons/arrow_right.svg";
import ReloadIcon from "@/public/icons/reload.svg";

// Auth
import { signOut } from "next-auth/react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const isApiError =
		error.name === "TRPCClientError" ||
		(error.stack && error.stack.split(":")[0] === "TRPCError");
	const [loading, setLoading] = useState(false);

	async function handleSignOut() {
		setLoading(true);

		await signOut({
			callbackUrl: "/",
		});
	}

	return (
		<div className="relative z-10 flex h-screen flex-col items-center justify-start overflow-hidden lg:flex-row lg:justify-between">
			<BoardTilt />
			<div className="order-1 flex flex-col items-start justify-start gap-12 px-9 lg:order-3 lg:px-0">
				<div className="mr-24 flex flex-col items-start justify-start gap-8">
					<div className="flex flex-col items-start justify-start">
						<h1 className="font-title text-3xl font-black leading-tight text-neutral">
							Parece que nos deparamos com um impasse...
						</h1>
						<p className="max-w-[80%] text-xl font-medium text-neutral">
							Um erro inesperado ocorreu durante a execução da sua
							jogada.
						</p>
					</div>
					<div className="max-w-[75%]">
						<Panel type="error">
							{error.message || error.digest}
						</Panel>
					</div>
				</div>
				{isApiError ? (
					<Button
						className="h-12 gap-4 px-9"
						onClick={handleSignOut}
						isLoading={loading}
					>
						<ArrowRightIcon className="-scale-x-100" />
						Voltar ao início
					</Button>
				) : (
					<Button className="h-12 gap-4 px-9" onClick={() => reset()}>
						<ReloadIcon />
						Tentar novamente
					</Button>
				)}
			</div>
			<div className="order-4 hidden h-full flex-col items-center justify-end border-l-2 border-primary-200/20 bg-gray-400 p-4 lg:flex">
				<Link href="/">
					<Logo />
				</Link>
			</div>
		</div>
	);
}
