//Components
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
	return (
		<div className="flex flex-wrap w-full items-stretch justify-start gap-10 relative overflow-hidden pt-[10rem] pb-[3rem] bg-[#282622]">
			<Image
				src={`/board.png`}
				width={2048}
				height={1024}
				className="opacity-5 lg:dark:opacity-[0.03] absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none z-20"
				alt="Chess board for decoration"
			/>
			<div className="flex-1 px-16">
				<p className="text-[#838380]">2024.1</p>
				<h1 className="text-white text-5xl font-bold font-title py-1">
					Próximos eventos
				</h1>
				<p className="text-[#838380]">
					Acompanhe os eventos seguintes do IChess, tanto internos,
					como externos, e saiba quando participar!
				</p>
			</div>
			<div className="flex-1 flex justify-center items-center">
				{/*Ajeitar props do botao*/}
				<Button asChild size={"xl"}>
					<Link href="/">Ver eventos antigos</Link>
				</Button>
			</div>
		</div>
	);
}
