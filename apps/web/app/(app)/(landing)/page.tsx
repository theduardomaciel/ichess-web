import Image from "next/image";
import Link from "next/link";

// Icons
import AccountIcon from "@/public/icons/account.svg";
import PiecesIcon from "@/public/icons/pieces.svg";

// Components
import { Button } from "@/components/ui/button";
import { Title } from "@/components/Title";

// Auth
import { auth } from "@ichess/auth";

export default async function Home() {
	const session = await auth();
	const isMember = !!session?.member?.role;

	return (
		<main className="flex min-h-screen flex-col items-center justify-between">
			<div className="flex flex-col items-start justify-center w-full h-screen relative gap-12 px-wrapper pt-16">
				<Image
					src={"/images/hero.png"}
					priority
					width={823}
					height={717}
					className="hidden sm:flex absolute right-0 bottom-0 h-full w-1/2 object-cover select-none pointer-events-none z-0"
					alt="Chess members image for illustration"
				/>
				<div className="absolute top-0 left-0 z-10 w-full sm:w-1/2 h-full bg-gray-400" />
				<div className="hidden sm:flex absolute bottom-0 right-0 z-10 w-1/2 h-full bg-gradient-to-b from-gray-400 from-10%" />
				<div className="hidden sm:flex absolute top-0 left-1/2 z-10 w-1/2 h-full bg-gradient-to-r from-gray-400 from-10%" />
				<Title />
				<Button asChild className="gap-4 z-30" size={"xl"}>
					{isMember ? (
						<Link href="/auth">
							<AccountIcon width={24} height={24} />
							Minha Conta
						</Link>
					) : (
						<Link href="/join">
							Registrar como admin
						</Link>
					)}
				</Button>
			</div>
		</main>
	);
}
