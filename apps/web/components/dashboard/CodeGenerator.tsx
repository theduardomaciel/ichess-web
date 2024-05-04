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
import { trpc } from "@/lib/trpc/react";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface CodeGeneratorProps {
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
	charactersAmount,
	lifetime = 30000,
}: CodeGeneratorProps) {
	const [code, setCode] = useState<string | undefined | null>(undefined);
	const toast = useToast();

	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [expiringDate, setExpiringDate] = useState<Date | undefined>(undefined);

	const remainingTime = expiringDate
		? Math.max(expiringDate.getTime() - currentDate.getTime(), 0)
		: 0;

	const mutation = trpc.getVerificationCode.useMutation();

	async function generateCode() {
		setCode(undefined);

		try {
			let newCode: string | null = null;
			let expires: Date | undefined = undefined;

			const localStorageExpires = localStorage.getItem("expires");

			// Restore code if it's still valid
			if (
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
				{code === undefined ? (
					<ul className="flex w-full flex-row items-center justify-between gap-2.5">
						{Array.from({ length: charactersAmount || 6 }, (_, i) => (
							<li
								key={i}
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
							<button
								type="button"
								key={i}
								className="flex w-full items-center justify-center rounded-sm bg-gray-200 px-1 py-6 text-4xl font-extrabold text-neutral cursor-default group group-hover:bg-primary-100"
								onClick={() => {
									navigator.clipboard.writeText(code);
									toast.toast({
										title: "Código copiado",
										description:
											"O código foi copiado para a área de transferência",
										variant: "success",
									});
								}}
							>
								{character}
							</button>
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
					onClick={generateCode}
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
