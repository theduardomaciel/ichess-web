"use client";
import { useEffect, useState } from "react";

// Icons
import ArrowRightIcon from "@/public/icons/arrow_right.svg";
import ReloadIcon from "@/public/icons/reload.svg";
import { Loader2 } from "lucide-react";

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

// API
import { env } from "@ichess/env";
import { trpc } from "@/lib/trpc/react";

// Pusher
import Pusher from "pusher-js";

interface CodeGeneratorProps {
	PUSHER_CLUSTER: string;
	charactersAmount?: number;
	lifetime?: number;
}

function resetProgress() {
	const progressBar = document.getElementById("progress_bar");

	if (progressBar) {
		progressBar.style.transition = "width 1s linear";
		progressBar.style.width = "0%";
	}
}

export function CodeGenerator({
	PUSHER_CLUSTER,
	charactersAmount,
	lifetime = 75000,
}: CodeGeneratorProps) {
	const [code, setCode] = useState<string | undefined | null>(undefined);

	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [expiringDate, setExpiringDate] = useState<Date | undefined>(undefined);

	const remainingTime = expiringDate
		? Math.max(expiringDate.getTime() - currentDate.getTime(), 0)
		: 0;

	const mutation = trpc.getVerificationCode.useMutation();

	async function generateCode(overrideCache?: boolean) {
		setCode(undefined);

		try {
			let newCode: string | null = null;
			let expires: Date | undefined = undefined;

			const localStorageExpires = localStorage.getItem("expires");

			// Restore code if it's still valid (and not forced to regenerate)
			if (
				!overrideCache &&
				localStorageExpires &&
				new Date(localStorageExpires).getTime() > new Date().getTime()
			) {
				newCode = localStorage.getItem("code") || null;
				expires = new Date(localStorageExpires);

				localStorage.removeItem("code");
				localStorage.removeItem("expires");

				console.log("Restored code:", newCode, expires);
			} else {
				const { code: serverNewCode, expires: serverExpires } =
					await mutation.mutateAsync({
						charactersAmount,
						lifetime,
					});

				newCode = serverNewCode;
				expires = serverExpires;

				console.log("Generated code:", newCode, expires);
			}

			if (newCode && expires) {
				if (code) {
					resetProgress();
				}

				setCode(newCode);
				setExpiringDate(expires);

				localStorage.setItem("code", newCode);
				localStorage.setItem("expires", expires.toISOString());
			} else {
				setCode(null);
			}
		} catch (error) {
			console.error("Error generating code:", error);
			setCode(null);
		}
	}

	useEffect(() => {
		const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
			cluster: PUSHER_CLUSTER,
		});

		const channel = pusher.subscribe("verification-channel");
		channel.bind(
			"use-verification-code",
			({ verificationCode }: { verificationCode: string }) => {
				if (code === verificationCode) {
					generateCode(true);
				}
			},
		);

		return () => {
			pusher.disconnect();
		};
	}, [PUSHER_CLUSTER, generateCode, code]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentDate(new Date());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<Dialog
			onOpenChange={(isOpen) => {
				if (isOpen && !code) {
					generateCode();
				}
			}}
		>
			<DialogTrigger asChild>
				<Button size={"xl"} className="max-md:w-full max-md:pl-0 max-md:pr-0">
					Gerar código
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full sm:max-w-lg" hasCloseButton={false}>
				<DialogHeader className="items-center justify-center">
					<DialogTitle>O código gerado é</DialogTitle>
					<DialogDescription>
						{new Date().toLocaleString("pt-BR", {
							weekday: "long",
							day: "numeric",
							month: "long",
							year: "numeric",
							/* hour: "numeric",
							minute: "numeric",
							second: "numeric", */
						})}
					</DialogDescription>
				</DialogHeader>
				{code === undefined || remainingTime <= 0 ? (
					<ul className="flex w-full flex-row items-center justify-between gap-2.5">
						{Array.from({ length: charactersAmount || 6 }, (_, i) => (
							<li
								key={`${charactersAmount || 6}-${i}`}
								className="w-full h-[88px] bg-gray-200 rounded-sm animate-pulse"
							/>
						))}
					</ul>
				) : code === null ? (
					<DialogDescription className="mx-auto my-12">
						Ocorreu um erro ao gerar o código
					</DialogDescription>
				) : (
					<ul className="flex w-full flex-row items-center justify-between gap-2.5">
						{code?.split("").map((character, i) => (
							<li
								key={`${charactersAmount || 6}-${i}`}
								className="flex w-full items-center justify-center rounded-sm bg-gray-200 px-1 py-6 text-4xl font-extrabold text-neutral"
							>
								{character}
							</li>
						))}
					</ul>
				)}
				<div className="flex w-full h-3 rounded-full bg-gray-300">
					<div
						id="progress_bar"
						className="h-full bg-primary-100 rounded-full transition-[width] ease-linear"
						style={{
							width: `${
								code ? Math.max((remainingTime / lifetime) * 100, 0) : 0
							}%`,
						}}
					/>
				</div>
				<Button
					className="group h-14 w-full justify-between p-4"
					size={"xl"}
					variant={"secondary"}
					onClick={() => generateCode()}
					disabled={remainingTime > 0 || !code}
				>
					Gerar novo código
					{code === undefined ? (
						<Loader2 className="w-4 h-4 text-primary-100 animate-spin" />
					) : (
						<ReloadIcon className="group-hover:animate-one-spin" />
					)}
				</Button>
				<DialogFooter className="w-full sm:justify-start">
					<DialogClose asChild>
						<Button className="w-full" type="button" size={"xl"}>
							<ArrowRightIcon className="-scale-100" />
							Voltar
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
