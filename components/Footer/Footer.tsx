import Link from "next/link";

import Logo from "@/public/logo.svg";

import GithubIcon from "@/public/icons/github.svg";
import DiscordIcon from "@/public/icons/discord.svg";
import InstagramIcon from "@/public/icons/instagram.svg";

// Components
import Status from "./subcomponents/Status";
import ThemePicker from "./subcomponents/ThemePicker";

export default function Footer() {
	return (
		<footer className="flex flex-row items-start justify-between px-wrapper py-20 z-50 bg-background-300">
			{/* Column 1 */}
			<div className="flex flex-col items-start justify-center gap-12">
				<div className="flex flex-col items-start justify-center gap-4">
					<ul className="flex flex-row items-center justify-start gap-5">
						<Link href={`/`}>
							<Logo />
						</Link>
						<div className="h-8 w-[1px] bg-white/50" />
						<a
							href={`https://github.com/theduardomaciel/ichess-web`}
						>
							<GithubIcon />
						</a>
						<a href={`https://discord.gg/jrMfHpRnCf`}>
							<DiscordIcon />
						</a>
						<a href={`https://instagram.com/ichess.ufal`}>
							<InstagramIcon />
						</a>
					</ul>
					<p>
						Copyright @ 2024 IChess. Todos os direitos reservados.
					</p>
				</div>
				<div className="flex flex-row justify-center items-start gap-9">
					<ThemePicker />
					<Status />
				</div>
			</div>
			{/* Column 2 */}
			<div className="flex flex-row items-start justify-end gap-20">
				<FooterSection
					title="Sobre"
					items={[
						{ label: "Sobre nós", href: "/sobre" },
						{ label: "Contato", href: "/contato" },
					]}
				/>
				<FooterSection
					title="Suporte"
					items={[
						{ label: "FAQ", href: "/faq" },
						{
							label: "Política de Horas",
							href: "/politica-de-horas",
						},
						{ label: "Instituição", href: "/instituicao" },
					]}
				/>
			</div>
		</footer>
	);
}

interface FooterSectionProps {
	title: string;
	items: {
		label: string;
		href: string;
	}[];
}

function FooterSection({ title, items }: FooterSectionProps) {
	return (
		<div className="flex flex-col items-start justify-center gap-6">
			<h6 className="text-white text-base font-black font-title">
				{title}
			</h6>
			<ul className="flex flex-col items-start justify-center gap-5">
				{items.map((item, index) => (
					<li key={index}>
						<a href={item.href} className="font-medium">
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
