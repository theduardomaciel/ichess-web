import { auth } from "@ichess/auth";
import Link from "next/link";

import BuildingIcon from "@/public/icons/building.svg";

// Components
import { Button } from "@/components/ui/button";
import { NotLogged } from "@/components/auth/NotLogged";

export default async function LandingMembers() {
	const isLogged = await auth();

	return (
		<main className="flex min-h-screen flex-col items-start justify-start">
			<div className="flex h-full w-full flex-col items-center justify-center gap-6 px-wrapper pt-36">
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
				<BuildingIcon />
				<h1 className="text-center font-title text-4xl font-bold">
					Essa página ainda não está pronta!
				</h1>
				<p className="text-center text-lg">
					Mas não se preocupe, tudo está sendo preparado com muito
					carinho ❤️
				</p>
				<Button asChild>
					<Link href="/members/7cc7ea15-c92d-4301-9d96-856bc21bafcc">
						Ver membro
					</Link>
				</Button>
			</div>
		</main>
	);
}
