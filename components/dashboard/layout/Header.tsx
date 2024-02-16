"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";

// Components
import { Button } from "@/components/ui/button";

// Assets
import Logo from "@/public/logo.svg";

import AddIcon from "@/public/icons/add.svg";
import ChevronUp from "@/public/icons/chevron_up.svg";

const SECTIONS = [
	{
		title: "Visão Geral",
		href: "/dashboard",
	},
	{
		title: "Eventos",
		href: "/dashboard/events",
	},
	{
		title: "Membros",
		href: "/dashboard/members",
	},
];

export default function DashboardHeader() {
	const pathname = usePathname();
	const [isExpanded, setIsExpanded] = useState(true);

	return (
		<header
			className={cn(
				"flex flex-col md:flex-row md:justify-between md:items-center p-wrapper md:h-36 md:py-0 gap-[var(--wrapper)] items-start max-h-[calc(5.6rem+var(--wrapper)/2)] transition-all duration-300 overflow-y-hidden relative w-full overflow-hidden",
				"bg-background-300 md:bg-transparent",
				{
					"max-h-[50rem]": isExpanded,
				}
			)}
		>
			<div className="flex flex-row items-center justify-between w-full md:w-[25%] h-14">
				<Link href={`/dashboard`}>
					<Logo />
				</Link>
				<button
					title="Toggle menu expansion"
					className="inline-flex md:hidden w-10 h-10 p-2 bg-background-200 hover:bg-background-300 transition-colors rounded-lg justify-center items-center gap-2.5"
					onClick={() => setIsExpanded((prev) => !prev)}
				>
					<ChevronUp
						className={cn("rotate-180 transition-transform", {
							"rotate-0": isExpanded,
						})}
					/>
				</button>
			</div>
			<div className="flex flex-col sm:flex-row sm:gap-[calc(var(--wrapper)*2)] items-center justify-end gap-[var(--wrapper)] w-full">
				<ul
					className={cn(
						"flex flex-row items-center justify-between md:justify-center md:gap-12 w-full transition-[opacity,transform] lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2",
						{
							"opacity-0 translate-y-[-1rem]": !isExpanded,
							"opacity-100 translate-y-0": isExpanded,
						}
					)}
				>
					{SECTIONS.map(({ title, href }) => (
						<li
							key={title}
							className={cn(
								"text-base font-semibold tracking-tight text-center transition-opacity",
								{
									"opacity-50": pathname !== href,
								}
							)}
						>
							<Link href={href} className="relative text-nowrap">
								{title}
								{/* // Active indicator */}
								<span
									className={cn(
										"absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-[3px] bg-neutral rounded-t-md opacity-0 transition-[opacity,transform] duration-300 translate-y-4",
										{
											"translate-y-0 -translate-x-1/2 opacity-80":
												pathname === href,
										}
									)}
								/>
							</Link>
						</li>
					))}
				</ul>
				<Link className="w-full md:w-[25%]" href={`/dashboard/add`}>
					<Button
						variant={"outline"}
						className={cn(
							"text-xs uppercase border-primary-100 hover:bg-primary-100 w-full transition-[opacity,transform,background-color] duration-300 px-4",
							{
								"opacity-0 max-sm:translate-x-[-1rem]":
									!isExpanded,
								"opacity-100 translate-y-0": isExpanded,
								"bg-primary-100": pathname === "/dashboard/add",
							}
						)}
					>
						<AddIcon className="w-4 h-4" />
						Adicionar evento
					</Button>
				</Link>
			</div>
		</header>
	);
}
