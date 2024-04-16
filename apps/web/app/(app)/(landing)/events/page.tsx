import Link from "next/link";

import { cn } from "@/lib/utils";

// Components
import { NoEvents } from "@/components/events/NoEvents";
import { Header } from "./header";
import { StyledTitle } from "@/components/events/StyledTitle";
import { ExternalEvent } from "@/components/events/ExternalEvent";
import { NotLogged } from "@/components/events/NotLogged";
import { EventPreview } from "@/components/events/EventPreview";

// Types
import { events, type Event } from "@/lib/fake_data";

/*
	- Unificar internal e external event
	- Ajeitar tailwind
	- Ajeitar tags html
*/

export default function Events() {
	const isLogged: boolean = false; //substituir isso qnd tiver em producao

	//substituir esses arrays por requests qnd tiver em producao
	const monthExternal: Array<Event> = [events[0]];

	const thisWeekInternal: Array<Event> = events.slice(0, 3);

	const nextWeekInternal: Array<Event> = [];

	return (
		<>
			<Header />
			<main className="px-wrapper pb-14 pt-8 text-center text-neutral">
				<StyledTitle title="Evento Externos" />

				<div className="text-left">
					<h3 className="pb-3 pt-12 font-title text-2xl font-bold">
						Este Mês
					</h3>

					<div className="flex w-full gap-4 pb-16 pt-2">
						{monthExternal.length ? (
							monthExternal.map((event: Event, index: number) => (
								<ExternalEvent key={index} {...event} />
							))
						) : (
							<NoEvents />
						)}
					</div>

					<StyledTitle title="Eventos Internos" />
				</div>

				{!isLogged ? (
					<NotLogged>
						Para acessar os eventos internos você precisa ser membro
						integrante do IChess :( <br />
						Caso você seja parte do IC, e tem interesse em
						participar,{" "}
						<Link
							className="text-primary-200 underline"
							href={`/join`}
						>
							ingresse já
						</Link>{" "}
						no projeto!
					</NotLogged>
				) : null}

				<div
					className={cn(
						"mt-8 flex w-full flex-col items-start justify-start gap-4",
						{
							"pointer-events-none opacity-50": !isLogged,
						},
					)}
				>
					<h3 className="pb-3 pt-4 text-start font-title text-2xl font-bold text-neutral">
						Esta Semana
					</h3>
					<div className="flex w-full grid-cols-2 flex-col gap-4 md:grid">
						{thisWeekInternal.length ? (
							thisWeekInternal.map(
								(event: Event, index: number) => (
									<EventPreview
										key={index}
										event={event}
										showmoderators={false}
									/>
								),
							)
						) : (
							<NoEvents />
						)}
					</div>

					<h3 className="pb-3 pt-10 text-start font-title text-2xl font-bold text-neutral">
						Próxima Semana
					</h3>
					<div className="flex w-full gap-4">
						{nextWeekInternal.length ? (
							nextWeekInternal.map(
								(event: Event, index: number) => (
									<EventPreview
										key={index}
										event={event}
										showmoderators={false}
									/>
								),
							)
						) : (
							<NoEvents />
						)}
					</div>
				</div>
			</main>
		</>
	);
}

/*
<main className="flex min-h-screen flex-col items-start justify-start">
	<div className="flex flex-col items-center justify-center w-full h-full pt-36 gap-6 px-wrapper">
		<BuildingIcon />
		<h1 className="font-title font-bold text-4xl text-center">
			Essa página ainda não está pronta!
		</h1>
		<p className="text-lg text-center">
			Mas não se preocupe, tudo está sendo preparado com muito
			carinho ❤️
		</p>
	</div>
</main>
*/
