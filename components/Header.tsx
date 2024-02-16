import Logo from "@/public/logo.svg";
import Link from "next/link";

export default function Header() {
	return (
		<header className="flex flex-row items-center justify-between absolute top-0 left-0 right-0 w-full px-wrapper py-9 z-50">
			<Link href={`/`}>
				<Logo />
			</Link>
			<ul className="hidden md:flex flex-row items-center justify-end gap-12">
				<li>
					<Link href={`/`} className="font-medium cursor-not-allowed">
						Home
					</Link>
				</li>
				<li>
					<Link href={`/`} className="font-medium cursor-not-allowed">
						Sobre
					</Link>
				</li>
				<li>
					<Link href={`/`} className="font-medium cursor-not-allowed">
						Eventos
					</Link>
				</li>
			</ul>
		</header>
	);
}
