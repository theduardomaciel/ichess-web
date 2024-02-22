//Types
import { EventProps } from "@/components/events/Event.model";

export function InternalEvent(props: EventProps) {
	return (
		<div className="flex-1 bg-[#28241c] rounded-md text-start p-6">
			<h1 className="font-title text-[#8c8b8b] font-bold text-2xl">
				{props.title || "Sem título"}
			</h1>
			<p className="text-[#4a4846] font-semibold">
				{props.description || "Sem descrição"}
			</p>
			<div className="flex items-center justify-center text-[#858484] font-semibold gap-6 pt-5">
				<p className="font-bold">ACE</p>
				<p className="flex-1">
					{
						props.description ||
							"Sem descrição" /** ver isso com eduardo */
					}
				</p>
				<p>{props.date || "(Sem data)"}</p>
			</div>
		</div>
	);
}