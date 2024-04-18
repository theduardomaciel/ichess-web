import { Suspense } from "react";
import Link from "next/link";

// Icons
import ArrowRightIcon from "@/public/icons/arrow_right.svg";

// Components
import MutateEventForm from "@/components/forms/MutateEventForm";

// API
import { env } from "@ichess/env";
import { serverClient } from "@/lib/trpc/server";

export default async function EditEventPage({
	params,
}: {
	params: { id: string };
}) {
	const projectId = env.PROJECT_ID;

	const { event } = await serverClient.getEvent({
		eventId: params.id,
		projectId,
	});

	return (
		<main className="flex min-h-screen flex-col items-start justify-start gap-9 px-wrapper py-12 lg:pb-24">
			<div className="flex flex-col items-start justify-start">
				<Link href={`/dashboard/events/${params.id}`}>
					<div className="group z-20 flex cursor-pointer flex-row items-center justify-start gap-2">
						<ArrowRightIcon
							className={
								"-scale-x-100 transition-transform group-hover:-translate-x-2"
							}
						/>
						<span className="pointer-events-none z-10 group-hover:underline">
							Voltar para o evento
						</span>
					</div>
				</Link>
				<h1 className="text-6xl font-bold">Editar evento</h1>
			</div>
			<Suspense fallback={<>CARREGANDO DADOS DO EVENTO...</>}>
				<MutateEventForm projectId={projectId} event={event} />
			</Suspense>
		</main>
	);
}
