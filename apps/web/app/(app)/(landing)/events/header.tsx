import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";

export function Header() {
	return (
		<div className="bg-vignette relative flex w-full flex-wrap items-stretch justify-between gap-10 overflow-hidden px-wrapper pb-[3rem] pt-[10rem]">
			<div className="bg-board absolute left-0 top-0 -z-10 h-full w-full" />
			<div className="flex-1">
				<p className="text-neutral/80">2024.1</p>
				<h1 className="py-1 font-title text-5xl font-bold leading-tight text-neutral md:leading-normal">
					Próximos eventos
				</h1>
				<p className="text-neutral/80 md:max-w-[57%]">
					Acompanhe os eventos seguintes do IChess, tanto internos,
					como externos, e saiba quando participar!
				</p>
			</div>
			<Button asChild size={"lg"}>
				<Link href="/">Ver eventos antigos</Link>
			</Button>
		</div>
	);
}
