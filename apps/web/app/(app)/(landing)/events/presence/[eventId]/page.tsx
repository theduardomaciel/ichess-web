import { getDateString, getTimeString } from "@/lib/utils";

// Components
import PresenceForm from "@/components/forms/PresenceForm";

import { Hero } from "@/components/Hero";
import { AceCard } from "@/components/dashboard/AceCard";
import { DateDisplay } from "@/components/ui/calendar";

// API
import { env } from "@ichess/env";
import { auth } from "@ichess/auth";
import { serverClient } from "@/lib/trpc/server";

export default async function PresencePage(
    props: {
        params: Promise<{ eventId: string }>;
    }
) {
    const params = await props.params;

    const {
        eventId
    } = params;

    const session = await auth();

    const { event } = await serverClient.getEvent({
		projectId: env.PROJECT_ID,
		eventId: eventId,
	});

    const dateString = getDateString(event);
    const timeFrom = getTimeString(event.dateFrom);
    const timeTo = getTimeString(event.dateTo);

    return (
		<>
			<Hero
				preTitle="Lista de Presença"
				title={event.name}
				description={event.description || "[nenhuma descrição provida]"}
				outro={
					<div className="flex flex-row items-center justify-start gap-4">
						<DateDisplay dateString={dateString} />
						<div className="h-1 w-1 rounded-full bg-neutral" />
						<p className="text-base font-medium">
							de {timeFrom} às {timeTo}
						</p>
					</div>
				}
			>
				<AceCard ace={event.ace} />
			</Hero>
			<PresenceForm email={session?.user.email} eventId={eventId} />
		</>
	);
}
