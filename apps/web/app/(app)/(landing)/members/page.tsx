import { Button } from "@/components/ui/button";
import BuildingIcon from "@/public/icons/building.svg";
import Link from "next/link";

export default function LandingMembers() {
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
				<Button asChild>
					<Link href="/members/2129312973">Ver membro</Link>
				</Button>
			</div>
		</main>
	);
}
