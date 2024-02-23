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
			<main className="text-neutral text-center pt-8 pb-14 px-wrapper">
				<StyledTitle title="Evento Externos" />

				<div className="text-left">
					<h2 className="text-2xl font-title font-bold pb-3 pt-12">
						Este Mês
					</h3>

					<div className="flex gap-4 w-full pt-2 pb-16">
						{monthExternal.length ? (
							monthExternal.map((event: Event, index: number) => (
								<ExternalEvent key={index} {...event} />
							))
						) : (
							<NoEvents />
						)}
					</div>

					<StyledTitle title="Eventos Internos" />

				{!isLogged ? (
					<NotLogged>
						Para acessar os eventos internos você precisa ser membro
						integrante do IChess :( <br />
						Caso você seja parte do IC, e tem interesse em
						participar,{" "}
						<Link
							className="underline text-primary-200"
							href={`/join`}
						>
							ingresse já
						</Link>{" "}
						no projeto!
					</NotLogged>
				) : null}

				<div
					className={cn(
						"flex flex-col items-start justify-start mt-8 gap-4 w-full",
						{
							"opacity-50 pointer-events-none": !isLogged,
						},
					)}
				>
					<h2 className="font-title font-bold text-neutral text-start text-2xl pt-4 pb-3">
						Esta Semana
					</h2>
					<div className="flex flex-col md:grid grid-cols-2 gap-4 w-full">
						{thisWeekInternal.length ? (
							thisWeekInternal.map(
								(event: Event, index: number) => (
									<EventPreview
										key={index}
										event={event}
										showResponsible={false}
									/>
								),
							)
						) : (
							<NoEvents />
						)}
					</div>

					<h2 className="font-title font-bold text-neutral text-start text-2xl pt-10 pb-3">
						Próxima Semana
					</h3>
					<div className="flex gap-4 w-full">
						{nextWeekInternal.length ? (
							nextWeekInternal.map(
								(event: Event, index: number) => (
									<EventPreview
										key={index}
										event={event}
										showResponsible={false}
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
