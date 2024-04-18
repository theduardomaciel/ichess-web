import { env } from "@ichess/env";

// Components
import MutateEventForm from "@/components/forms/MutateEventForm";

export default function MutateEventPage() {
	const projectId = env.PROJECT_ID;

	return (
		<main className="flex min-h-screen flex-col items-start justify-start px-wrapper py-12 lg:pb-24">
			<MutateEventForm projectId={projectId} />
		</main>
	);
}
