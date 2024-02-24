import Link from "next/link";

// Components
import BoardTilt from "@/components/Board";
import { Button } from "@/components/ui/button";

// Icons
import Logo from "@/public/logo.svg";
import ArrowRightIcon from "@/public/icons/arrow_right.svg";

export default function NotFound() {
	return (
		<div className="flex flex-col lg:flex-row items-center justify-start lg:justify-between h-screen relative z-10 overflow-hidden">
			<BoardTilt />
			<div className="order-1 lg:order-3 flex flex-col items-start justify-start gap-12 px-9 lg:px-0">
				<div className="flex flex-col items-start justify-start">
					<h1 className="text-neutral text-9xl font-black font-title leading-normal">
						404
					</h1>
					<p className="text-neutral text-2xl lg:text-3xl font-medium max-w-[70%]">
						Parece que suas jogadas foram longe demais...
					</p>
				</div>
				<Link href="/">
					<Button className="px-9 h-12 gap-4">
						<ArrowRightIcon className="-scale-x-100" />
						Voltar ao início
					</Button>
				</Link>
			</div>
			<div className="hidden order-4 lg:flex flex-col items-center justify-end h-full p-4 bg-gray-400 border-l-2 border-primary-200/20">
				<Link href="/">
					<Logo />
				</Link>
			</div>
		</div>
	);
}
