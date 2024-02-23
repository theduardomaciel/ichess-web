//Components
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
	return (
		<div className="flex flex-wrap w-full items-stretch justify-between gap-10 relative overflow-hidden pt-[10rem] pb-[3rem] px-wrapper bg-gray-400">
			<Image
				src={`/board.png`}
				width={2048}
				height={1024}
				className="opacity-5 lg:dark:opacity-[0.03] absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none z-20"
				alt="Chess board for decoration"
			/>
			<div className="flex-1">
				<p className="text-neutral/80">2024.1</p>
				<h1 className="text-neutral text-5xl font-bold font-title py-1 leading-tight md:leading-normal">
					Próximos eventos
				</h1>
				<p className="text-neutral/80 md:max-w-[57%]">
					Acompanhe os eventos seguintes do IChess, tanto internos,
					como externos, e saiba quando participar!
				</p>
			</div>
			{/*Ajeitar props do botao*/}
			<Button asChild size={"lg"}>
				<Link href="/">Ver eventos antigos</Link>
			</Button>
		</div>
	);
}
