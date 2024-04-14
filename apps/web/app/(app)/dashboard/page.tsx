import { serverClient } from "@/lib/trpc/server";
import BuildingIcon from "@/public/icons/building.svg";

export default async function DashboardLanding() {
	const { event } = await serverClient.getEvent(
		"71cac69a-6115-462f-87d1-54634c86821c",
	);

	console.log(event?.membersOnEvent[0].member);

	return (
		<main className="flex min-h-screen flex-col items-start justify-start">
			<div className="flex h-full w-full flex-col items-center justify-center gap-6 px-wrapper pt-36">
				<BuildingIcon />
				<h1 className="text-center font-title text-4xl font-bold">
					Essa página ainda não está pronta!
				</h1>
				<p className="text-center text-lg">
					Mas não se preocupe, tudo está sendo preparado com muito
					carinho ❤️
				</p>
			</div>
		</main>
	);
}
