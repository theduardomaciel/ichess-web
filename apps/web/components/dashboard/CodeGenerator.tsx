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
	Array.from({ length: charactersAmount || DEFAULT_CHARACTERS_AMOUNT }, () =>
		Math.floor(Math.random() * 10),
	);

export function CodeGenerator({ charactersAmount }: CodeGeneratorProps) {
	const [code, setCode] = useState(generateCode(charactersAmount));

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size={"xl"}
					className="max-md:w-full max-md:pl-0 max-md:pr-0"
				>
					Gerar código
				</Button>
			</DialogTrigger>
			<DialogContent
				className="w-full sm:max-w-lg"
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
				<ul className="flex w-full flex-row items-center justify-between gap-2.5">
					{code.map((character, i) => (
						<li
							key={i}
							className="flex w-full items-center justify-center rounded-sm bg-gray-200 px-1 py-6 text-4xl font-extrabold text-neutral"
						>
							{character}
						</li>
					))}
				</ul>
				<Button
					className="group h-14 w-full justify-between p-4"
					size={"xl"}
					variant={"secondary"}
					onClick={() => setCode(generateCode(charactersAmount))}
				>
					Gerar novo código
					<ReloadIcon className="group-hover:animate-one-spin" />
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
