import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
	buttonProps?: React.ComponentProps<typeof Button> & {
		icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		href: string;
	};
	title: string;
	description?: string;
	outro?: string;
}

export function Hero({ buttonProps, title, description, outro }: Props) {
	const {
		children,
		title: buttonTitle,
		icon: Icon,
		href,
		...rest
	} = buttonProps || {};

	const buttonChildren = (
		<>
			{Icon && <Icon width={24} height={24} />}
			{buttonTitle}
			{children}
		</>
	);

	return (
		<div className="bg-vignette relative flex w-full flex-wrap items-stretch justify-between gap-10 overflow-hidden px-wrapper pb-[3rem] pt-[10rem]">
			<div className="bg-board absolute left-0 top-0 -z-10 h-full w-full" />
			<div className="flex-1">
				{outro && <p className="text-neutral/80">{outro}</p>}
				<h1 className="py-1 font-title text-5xl font-bold leading-tight text-neutral md:leading-normal">
					{title}
				</h1>
				{description && (
					<p className="text-neutral/80 md:max-w-[57%]">
						{description}
					</p>
				)}
			</div>
			{buttonProps && (
				<Button asChild size={"lg"} title={buttonTitle} {...rest}>
					{href ? (
						<Link href={href}>{buttonChildren}</Link>
					) : (
						buttonChildren
					)}
				</Button>
			)}
		</div>
	);
}
