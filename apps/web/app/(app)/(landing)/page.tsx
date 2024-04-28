import Image from "next/image";
import Link from "next/link";

// Icons
import PiecesIcon from "@/public/icons/pieces.svg";

// Components
import { Button } from "@/components/ui/button";

import Title from "@/components/Title";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between">
			<div className="flex flex-col items-start justify-center w-full h-screen relative gap-12 px-wrapper pt-16">
				<Image
					src={"/images/hero.png"}
					priority
					width={823}
					height={717}
					className="hidden lg:flex absolute right-0 bottom-0 h-full w-1/2 object-cover select-none pointer-events-none z-0"
					alt="Chess members image for illustration"
				/>
				<div className="absolute top-0 left-0 z-10 w-full lg:w-1/2 h-full bg-gray-400" />
				<div className="hidden lg:flex absolute bottom-0 right-0 z-10 w-1/2 h-full bg-gradient-to-b from-gray-400 from-10%" />
				<div className="hidden lg:flex absolute top-0 left-1/2 z-10 w-1/2 h-full bg-gradient-to-r from-gray-400 from-10%" />
				<Title />
				<Button asChild className="z-50 gap-4" size={"xl"}>
					<Link href="/join">
						Quero participar
						<PiecesIcon />
					</Link>
				</Button>
				<div className="bg-board absolute top-0 left-0 w-full h-full opacity-40 z-10" />
			</div>
		</main>
	);
}
