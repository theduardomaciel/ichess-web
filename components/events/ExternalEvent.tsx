import Link from "next/link";

// Assets
import ArrowIcon from "@/public/icons/arrow_right.svg";

// Components
import { Button } from "@/components/ui/button";
import { DateDisplay } from "@/components/ui/calendar";

// Types
import type { Event } from "@/lib/fake_data";

export function ExternalEvent({
	name,
	description,
	dateFrom,
	timeFrom,
	timeTo,
}: Event) {
	return (
		<div className="w-full p-9 border-2 border-primary-200 rounded-md bg-gray-300">
			<h1 className="text-2xl font-title font-bold">
				{name || "(Sem título)"}
			</h1>
			<p className="pb-6 text-[#838380]">
				{description || "(Evento sem descrição)"}
			</p>

			<div className="flex w-full flex-wrap justify-between items-center gap-4">
				<Button asChild className="" size={"lg"}>
					<Link href="/">
						Quero participar
						<ArrowIcon />
					</Link>
				</Button>

				<DateDisplay
					size="md"
					dateString={`${dateFrom.toLocaleDateString("pt-BR", {
						month: "2-digit",
						day: "numeric",
					})} • das ${timeFrom} às ${timeTo}`}
				/>
			</div>
		</div>
	);
}
