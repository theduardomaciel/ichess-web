"use client";

// Icons
import ArrowRightIcon from "@/public/icons/arrow_right.svg";
import ReloadIcon from "@/public/icons/reload.svg";

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
import { useState } from "react";

interface CodeGeneratorProps {
	charactersAmount?: number;
}

const DEFAULT_CHARACTERS_AMOUNT = 6;

const generateCode = (charactersAmount?: number) =>
	Array.from(
		{ length: charactersAmount || DEFAULT_CHARACTERS_AMOUNT },
		(_, i) => Math.floor(Math.random() * 10)
	);

export function CodeGenerator({ charactersAmount }: CodeGeneratorProps) {
	const [code, setCode] = useState(generateCode(charactersAmount));

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={"xl"} className="max-sm:w-full">
					Gerar código
				</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-lg w-full"
				hasCloseButton={false}
			>
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
				<ul className="flex flex-row items-center justify-between w-full gap-2.5">
					{code.map((character, i) => (
						<li
							key={i}
							className="flex items-center justify-center px-1 py-6 w-full text-4xl font-extrabold text-neutral rounded-sm bg-gray-200"
						>
							{character}
						</li>
					))}
				</ul>
				<Button
					className="w-full justify-between p-4 h-14"
					size={"xl"}
					variant={"secondary"}
					onClick={() => setCode(generateCode(charactersAmount))}
				>
					Gerar novo código
					<ReloadIcon />
				</Button>
				<DialogFooter className="sm:justify-start w-full">
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
