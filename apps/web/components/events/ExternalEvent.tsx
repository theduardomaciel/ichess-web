import Link from "next/link";

import { cn } from "@/lib/utils";

// Assets
import ArrowIcon from "@/public/icons/arrow_right.svg";

// Components
import { Button } from "@/components/ui/button";
import { DateDisplay } from "@/components/ui/calendar";

// API
import { RouterOutput } from "@ichess/api";

interface Props {
	className?: string;
	event: RouterOutput["getEvents"]["events"][number];
}

export function ExternalEvent({ className, event }: Props) {
	return (
		<li
			className={cn(
				"w-full cursor-default list-none rounded-md border-2 border-primary-200 bg-gray-300 p-9",
				className,
			)}
		>
			<h1 className="font-title text-2xl font-bold">
				{event.name || "(Sem título)"}
			</h1>
			<p className="pb-6 text-[#838380]">
				{event.description || "(Evento sem descrição)"}
			</p>

			<div className="flex w-full flex-wrap items-center justify-between gap-4">
				<Button asChild className="" size={"lg"}>
					<Link href="/">
						Quero participar
						<ArrowIcon />
					</Link>
				</Button>

				<DateDisplay
					size="md"
					dateString={`${event.dateFrom.toLocaleDateString("pt-BR", {
						month: "2-digit",
						day: "numeric",
					})} • das ${event.dateFrom.toLocaleTimeString("pt-BR", {
						hour: "2-digit",
						minute: "2-digit",
					})} às ${event.dateTo.toLocaleTimeString("pt-BR", {
						hour: "2-digit",
						minute: "2-digit",
					})}`}
				/>
			</div>
		</li>
	);
}
