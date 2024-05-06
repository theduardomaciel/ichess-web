import Link from "next/link";

import Logo from "@/public/logo.svg";

import GithubIcon from "@/public/logos/github.svg";
import DiscordIcon from "@/public/logos/discord.svg";
import InstagramIcon from "@/public/logos/instagram.svg";

// Components
import Status from "./subcomponents/Status";
import ThemePicker from "./subcomponents/ThemePicker";
import FooterSection from "./subcomponents/FooterSection";

export default function Footer() {
	return (
		<footer className="relative z-50 flex flex-col-reverse flex-wrap items-start justify-between gap-9 bg-gray-400 px-wrapper py-20 md:flex-row">
			{/* Column 1 */}
			<div className="flex flex-col items-start justify-center gap-12">
				<div className="flex flex-col items-start justify-center gap-4">
					<div className="flex flex-row flex-wrap items-center justify-start gap-5">
						<Link href={"/"}>
							<Logo />
						</Link>
						<div className="h-8 w-[1px] bg-neutral/50" />
						<a
							title="Repositório do IChess no Github"
							target="_blank"
							rel="noreferrer"
							href={"https://github.com/theduardomaciel/ichess-web"}
						>
							<GithubIcon />
						</a>
						<a
							title="Servidor no Discord do IChess"
							target="_blank"
							rel="noreferrer"
							href={"https://discord.gg/jrMfHpRnCf"}
						>
							<DiscordIcon width={28} />
						</a>
						<a
							title="Perfil no Instagram do IChess"
							target="_blank"
							rel="noreferrer"
							href={"https://instagram.com/ichess.ufal"}
						>
							<InstagramIcon />
						</a>
					</div>
					<p>Copyright @ 2024 IChess. Todos os direitos reservados.</p>
				</div>
				<div className="flex flex-row flex-wrap items-start justify-start gap-9">
					<ThemePicker />
					<Status />
				</div>
			</div>
			{/* Column 2 */}
			<div className="flex flex-row items-start justify-start gap-20 lg:justify-end">
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
						{
							label: "Dashboard",
							href: "/dashboard/events",
						},
					]}
				/>
			</div>
		</footer>
	);
}
