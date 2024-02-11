import Image from "next/image";
import Link from "next/link";

import PiecesIcon from "@/public/icons/pieces.svg";

// Components
import { Button } from "@/components/ui/button";

import Title from "@/components/Title";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between">
			<div className="flex flex-col items-start justify-center w-full h-screen relative bg-background-300 gap-12 px-wrapper pt-16">
				<Image
					src={`/board.png`}
					width={2048}
					height={1024}
					className="opacity-[0.03] absolute top-0 left-0 select-none pointer-events-none z-0"
					alt="Chess board for decoration"
				/>
				<Image
					src={`/hero.png`}
					width={1440}
					height={717}
					className="absolute right-0 bottom-0 select-none pointer-events-none z-0"
					alt="Chess members image for illustration"
				/>
				<Title />
				<Button asChild className="z-50 gap-4" size={"xl"}>
					<Link href="/join">
						Quero participar
						<PiecesIcon />
					</Link>
				</Button>
			</div>
		</main>
	);
}
