import Image from "next/image";
import { z } from "zod";

import { cn } from "@/lib/utils";

// Components
import { DateDisplay } from "@/components/ui/calendar";
import { AceLabel } from "@/components/dashboard/AceCard";

// Utils
import { ACEs, type addEventFormSchema } from "@/lib/validations/AddEventForm";
import { moderators } from "@/lib/fake_data";

type Event = z.infer<typeof addEventFormSchema> & { id: string };

interface Props {
	event: Event;
	showResponsible?: boolean;
}

export function EventPreview({ event, showResponsible = true }: Props) {
	const ACE = ACEs.find((ace) => ace.id == event.ace);

	const responsible = event.responsible.map((id) => {
		const mod = moderators.find((mod) => mod.id === id);
		return mod;
	});
	const lastResponsible = responsible.length > 1 ? responsible.pop() : null;

	return (
		<li className="flex flex-col items-start justify-start p-9 gap-4 bg-gray-300 rounded-lg w-full hover:bg-gray-400 hover:outline outline-gray-200 transition-[background-color,outline]">
			<div className="flex flex-row items-center justify-between flex-wrap w-full gap-2">
				<h3 className="text-lg lg:text-xl font-extrabold font-title leading-snug text-left">
					{event.name}
				</h3>
				<p className="opacity-50 text-neutral text-xs lg:text-base font-semibold leading-none">
					#{event.id}
				</p>
			</div>
			<p className="text-sm lg:text-base text-muted text-left font-medium">
				{event.description || "[nenhuma descrição provida]"}
			</p>
			<div className="flex flex-row flex-wrap items-center gap-4 justify-between w-full mt-auto">
				{ACE && <AceLabel ace={ACE} />}
				<div className="flex flex-row items-center justify-between">
					<DateDisplay
						dateString={event.dateFrom.toLocaleDateString("pt-BR", {
							year: "numeric",
							month: "2-digit",
							day: "numeric",
						})}
					/>
					{/* <span className="text-sm font-medium">{event.timeFrom}</span> */}
				</div>
			</div>
			{showResponsible && (
				<div className="flex flex-row flex-wrap items-center justify-between pt-4 border-t border-t-gray-100 w-full gap-4">
					<div className="flex flex-row items-center justify-start gap-2 max-sm:w-full">
						<ProfileImages
							image_urls={responsible
								.map((mod) => mod!.image_url)
								.concat(lastResponsible?.image_url || [])}
						/>
						<span className="text-left text-neutral text-sm font-semibold">
							Organizado por{" "}
							{responsible.map((mod) => mod?.name).join(", ")}{" "}
							{lastResponsible && "e"} {lastResponsible?.name}
						</span>
					</div>
					<p className="text-right text-neutral text-sm font-semibold">
						+ de <span className="underline">10 membros</span>{" "}
						participaram
					</p>
				</div>
			)}
		</li>
	);
}

function ProfileImages({ image_urls }: { image_urls: string[] }) {
	return (
		<div className="flex flex-row items-center justify-start">
			{image_urls.map((url) => (
				<Image
					src={url}
					alt="Profile Image"
					key={url}
					height={24}
					width={24}
					className={cn("w-6 h-6 min-w-6 rounded-full", {
						"-ml-2": image_urls.indexOf(url) > 0,
					})}
				/>
			))}
		</div>
	);
}
