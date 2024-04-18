import Image from "next/image";

// Components
import PresenceForm from "@/components/forms/PresenceForm";
import { DateDisplay } from "@/components/ui/calendar";
import { AceCard } from "@/components/dashboard/AceCard";
import { ACEs } from "@/lib/validations/MutateEventForm";

export default function PresencePage() {
	return (
		<main className="flex min-h-screen flex-col items-start justify-start">
			<div className="bg-board relative flex w-full flex-col items-start justify-between gap-9 px-wrapper pb-12 pt-36 sm:flex-row ">
				<div className="z-20 flex w-full flex-col items-start justify-start gap-4 md:max-w-[50%]">
					<h2 className="text-lg font-semibold text-foreground">
						Lista de Presença
					</h2>
					<h1 className="text-left font-title text-5xl font-extrabold">
						Reunião Semanal
					</h1>
					<h2 className="text-left font-semibold text-foreground">
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
					className="z-20 border border-primary-200/50"
				/>
			</div>
			<PresenceForm />
		</main>
	);
}
