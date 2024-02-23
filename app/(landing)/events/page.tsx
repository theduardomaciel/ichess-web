//Components
import { NoEvents } from "@/components/events/NoEvents";
import { Header } from "./header";
import { StyledTitle } from "@/components/events/StyledTitle";
import { ExternalEvent } from "@/components/events/ExternalEvent";
import { InternalEvent } from "@/components/events/InternalEvent";
import { NotLogged } from "@/components/events/NotLogged";

//Types
import { EventProps } from "@/components/events/Event.model";

/*
- Unificar internal e external event
- Ajeitar tailwind
- Ajeitar tags html
- Fazer styled title receber parametro por node
*/

export default function Events() {
	const isLogged: boolean = false; //substituir isso qnd tiver em producao

	//substituir esses arrays por requests qnd tiver em producao
	const monthExternal: Array<EventProps> = [
		{
			title: "Futuro Evento",
			description: "Este é um evento do IC onde iremos jogar xadrez",
			date: "30/01 • das 13h às 17h",
			state: "join",
		},
	];

	const thisWeekInternal: Array<EventProps> = [
		{
			title: "Torneio de Engenharia",
			description: "Torneio classificatório do IChess",
			date: "17/02 • das 12h às 14h",
			state: "read-only",
		},
		{
			title: "Torneio de Ciência",
			description: "Torneio amistoso para os alunos de CC",
			date: "15/02 • das 12h às 16h",
			state: "read-only",
		},
	];

	const nextWeekInternal: Array<EventProps> = [];

	return (
		<>
			<Header />
			<main className="bg-[#191817] text-white text-center pt-8 pb-14">
				<StyledTitle title="Evento Externos" />

				<div className="text-left w-10/12 m-auto">
					<h3 className="text-2xl font-title font-bold pb-3 pt-12">
						Este Mês
					</h3>

					<div className="flex gap-4 w-full pt-2 pb-16">
						{monthExternal.length ? (
							monthExternal.map(
								(event: EventProps, index: number) => (
									<ExternalEvent key={index} {...event} />
								)
							)
						) : (
							<NoEvents />
						)}
					</div>

					<StyledTitle title="Eventos Internos" />

					{!isLogged ? <NotLogged /> : null}

					<h3 className="font-title font-bold text-[#8c8b8b] text-start text-2xl pt-4 pb-3">
						Esta Semana
					</h3>
					<div className="flex flex-wrap gap-4 w-full">
						{thisWeekInternal.length ? (
							thisWeekInternal.map(
								(ExternalEvent: EventProps, index: number) => (
									<InternalEvent
										key={index}
										{...ExternalEvent}
									/>
								)
							)
						) : (
							<NoEvents />
						)}
					</div>

					<h3 className="font-title font-bold text-[#8c8b8b] text-start text-2xl pt-10 pb-3">
						Próxima Semana
					</h3>
					<div className="flex gap-4 w-full">
						{nextWeekInternal.length ? (
							nextWeekInternal.map(
								(ExternalEvent: EventProps, index: number) => (
									<InternalEvent
										key={index}
										{...ExternalEvent}
									/>
								)
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
