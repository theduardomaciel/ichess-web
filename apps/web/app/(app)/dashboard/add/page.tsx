import AddEventForm from "@/components/forms/AddEventForm";
import { env } from "@ichess/env";

export default function AddEventPage() {
	const projectId = env.PROJECT_ID;

	return (
		<main className="flex min-h-screen flex-col items-start justify-start px-wrapper py-12 lg:pb-24">
			<AddEventForm projectId={projectId} />
		</main>
	);
}
