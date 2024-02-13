import BuildingIcon from "@/public/icons/building.svg";

export default function EventsOverall() {
	return (
		<main className="flex min-h-screen flex-col items-start justify-start">
			<div className="flex flex-col items-center justify-center w-full h-full pt-36 gap-6 px-wrapper">
				<BuildingIcon />
				<h1 className="font-title font-bold text-4xl text-center">
					Essa página ainda não está pronta!
				</h1>
				<p className="text-lg text-center">
					Mas não se preocupe, tudo está sendo preparado com muito
					carinho!
				</p>
			</div>
		</main>
	);
}
