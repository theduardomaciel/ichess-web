import Link from "next/link";

import Logo from "@/public/logo.svg";

import GithubIcon from "@/public/logos/github.svg";
import DiscordIcon from "@/public/logos/discord.svg";
import InstagramIcon from "@/public/logos/instagram.svg";

// Components
import Status from "./subcomponents/Status";
import ThemePicker from "./subcomponents/ThemePicker";

export default function Footer() {
	return (
		<footer className="flex flex-col-reverse md:flex-row flex-wrap items-start justify-between px-wrapper py-20 z-50 bg-gray-400 gap-9 relative">
			{/* Column 1 */}
			<div className="flex flex-col items-start justify-center gap-12">
				<div className="flex flex-col items-start justify-center gap-4">
					<div className="flex flex-row items-center justify-start gap-5 flex-wrap">
						<Link href={`/`}>
							<Logo />
						</Link>
						<div className="h-8 w-[1px] bg-neutral/50" />
						<a
							title="Repositório do Projeto IChess no Github"
							target="_blank"
							href={`https://github.com/theduardomaciel/ichess-web`}
						>
							<GithubIcon />
						</a>
						<a
							title="Servidor do Discord IChess UFAL"
							target="_blank"
							href={`https://discord.gg/jrMfHpRnCf`}
						>
							<DiscordIcon />
						</a>
						<a
							title="Instagram IChess UFAL"
							target="_blank"
							href={`https://instagram.com/ichess.ufal`}
						>
							<InstagramIcon />
						</a>
					</div>
					<p>
						Copyright @ 2024 IChess. Todos os direitos reservados.
					</p>
				</div>
				<div className="flex flex-row flex-wrap justify-start items-start gap-9">
					<ThemePicker />
					<Status />
				</div>
			</div>
			{/* Column 2 */}
			<div className="flex flex-row items-start justify-start lg:justify-end gap-20">
				<FooterSection
					title="Contato"
					items={[
						{
							label: "Instituto",
							href: "https://ic.ufal.br",
							target: "_blank",
						},
						{
							label: "E-mail",
							href: "mailto:ichess.ufal@gmail.com",
						},
					]}
				/>
				<FooterSection
					title="Mais"
					items={[
						{
							label: "Política de Horas",
							href: "https://drive.google.com/file/d/1lcP4scEH7wrscuBN98DmDGVsytYv2rr-/view?usp=drive_link",
							target: "_blank",
						},
						{ label: "Dashboard", href: "/dashboard" },
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
		target?: "_blank" | "_self";
	}[];
}

function FooterSection({ title, items }: FooterSectionProps) {
	return (
		<div className="flex flex-col items-start justify-center gap-6">
			<h6 className="text-neutral text-base font-black font-title">
				{title}
			</h6>
			<ul className="flex flex-col items-start justify-center gap-5">
				{items.map((item, index) => (
					<li key={index}>
						<a
							href={item.href}
							target={item.target ?? "_self"}
							className="font-medium"
						>
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
