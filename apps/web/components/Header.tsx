"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

// Icons
import Logo from "@/public/logo.svg";
import { Button } from "./ui/button";

const SECTIONS = [
	{
		title: "Sobre",
		href: "/",
	},
	{
		title: "Membros",
		href: "/members",
	},
	{
		title: "Eventos",
		href: "/events",
	},
];

const sectionsHref = SECTIONS.map((section) => section.href);

interface Props {
	isMember?: boolean;
}

export default function Header({ isMember }: Props) {
	const pathname = usePathname();
	const hrefIsOneOfSections = sectionsHref.includes(pathname);

	return (
		<header className="flex flex-row items-center justify-between absolute top-0 left-0 right-0 w-full px-wrapper py-9 z-50">
			<Link href={"/"}>
				<Logo />
			</Link>
			<ul className="hidden md:flex flex-row items-center justify-end gap-12">
				{SECTIONS.map(({ title, href }) => (
					<li
						key={title}
						className={cn(
							"text-base font-medium text-center transition-opacity",
							{
								"opacity-50": hrefIsOneOfSections && pathname !== href,
							},
						)}
					>
						<Link href={href} className={"relative text-nowrap"}>
							{title}
						</Link>
					</li>
				))}
				{/* {isMember && (
					<Button
						variant={"outline"}
						size={"sm"}
						className="uppercase text-xs border-primary-100 dark:border-primary-100 hover:bg-primary-100/10 px-6"
						asChild
					>
						<Link href={"/auth"}>Minha Conta</Link>
					</Button>
				)} */}
			</ul>
		</header>
	);
}
