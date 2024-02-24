import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";

export function Header() {
	return (
		<div className="flex flex-wrap w-full items-stretch justify-between gap-10 relative overflow-hidden pt-[10rem] pb-[3rem] px-wrapper bg-board">
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
