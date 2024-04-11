import Image from "next/image";

// Components
import PresenceForm from "@/components/forms/PresenceForm";
import { DateDisplay } from "@/components/ui/calendar";
import { AceCard } from "@/components/dashboard/AceCard";
import { ACEs } from "@/lib/validations/AddEventForm";

export default function PresencePage() {
	return (
		<main className="flex min-h-screen flex-col items-start justify-start">
			<div className="flex flex-col sm:flex-row items-start justify-between relative pt-36 pb-12 px-wrapper w-full bg-board gap-9 ">
				<div className="flex flex-col items-start justify-start gap-4 w-full md:max-w-[50%] z-20">
					<h2 className="text-foreground text-lg font-semibold">
						Lista de Presença
					</h2>
					<h1 className="font-title font-extrabold text-5xl text-left">
						Reunião Semanal
					</h1>
					<h2 className="text-left text-foreground font-semibold">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Pellentesque at odio fermentum augue consequat mollis
						dignissim at lacus.
					</h2>
					<DateDisplay
						dateString={new Date().toLocaleString("pt-BR", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
						size="md"
					/>
				</div>
				<AceCard
					ace={ACEs[0]}
					className="border border-primary-200/50 z-20"
				/>
			</div>
			<PresenceForm />
		</main>
	);
}
