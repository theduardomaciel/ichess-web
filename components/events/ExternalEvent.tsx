//Assets
import ArrowIcon from "@/public/icons/arrow_right.svg";
import CalendarIcon from "@/public/icons/calendar.svg";

//Components
import { Button } from "@/components/ui/button";
import Link from "next/link";

//Types
import { EventProps } from "@/components/events/Event.model";

export function ExternalEvent(props: EventProps) {
	return (
		<div className="w-full p-6 border-4 border-[#6c8c4b] rounded bg-[#332f28]">
			<h1 className="text-2xl font-title font-bold">
				{props.title || "(Sem título)"}
			</h1>
			<p className="pb-6 text-[#838380]">
				{props.description || "(Evento sem descrição)"}
			</p>

			<div className="flex flex-wrap justify-center items-center gap-4">
				<Button asChild className="" size={"xl"}>
					<Link href={props.url || "/"}>
						{"Quero participar" /** mudar isso */}
						<ArrowIcon />
					</Link>
				</Button>

				<div className="flex-1 flex items-center justify-end">
					<CalendarIcon className="h-6 pr-2" />
					<span className="text-end text-base">{props.date}</span>
				</div>
			</div>
		</div>
	);
}
