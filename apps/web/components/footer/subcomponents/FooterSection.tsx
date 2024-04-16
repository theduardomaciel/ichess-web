"use client";

import Link from "next/link";

interface FooterSectionProps {
	title: string;
	items: {
		label: string;
		href: string;
		target?: "_blank" | "_self";
	}[];
}

export default function FooterSection({ title, items }: FooterSectionProps) {
	return (
		<div className="flex flex-col items-start justify-center gap-6">
			<h6 className="font-title text-base font-black text-neutral">
				{title}
			</h6>
			<ul className="flex flex-col items-start justify-center gap-5">
				{items.map((item, index) => (
					<li key={index}>
						<Link
							href={item.href}
							target={item.target ?? "_self"}
							className="font-medium"
						>
							{item.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
