import type React from "react";
import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";

interface Props {
	children?: React.ReactNode;
	buttonProps?: React.ComponentProps<typeof Button> & {
		icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		iconClassName?: string;
		href: string;
		scroll?: boolean;
	};
	title: string;
	description?: string;
	preTitle?: string;
	outro?: React.ReactNode;
}

export function Hero({
	children,
	buttonProps,
	preTitle,
	title,
	description,
	outro,
}: Props) {
	const {
		children: buttonChildren,
		title: buttonTitle,
		icon: Icon,
		iconClassName,
		href,
		...rest
	} = buttonProps || {};

	const fullButtonChildren = (
		<>
			{Icon && <Icon width={24} height={24} className={iconClassName} />}
			{buttonTitle}
			{buttonChildren}
		</>
	);

	return (
		<div className="bg-vignette relative flex w-full flex-wrap items-stretch justify-between gap-10 overflow-hidden px-wrapper pb-[3rem] pt-[10rem]">
			<div className="bg-board absolute left-0 top-0 -z-10 h-full w-full" />
			<div className="flex flex-col flex-1 gap-4">
				{preTitle && <p className="text-neutral/80">{preTitle}</p>}
				<h1 className="-mt-4 font-title text-5xl font-bold leading-tight text-neutral">
					{title}
				</h1>
				{description && (
					<p className="text-neutral/80 md:max-w-[57%]">{description}</p>
				)}
				{outro && (
					<div className="flex flex-row items-center justify-start gap-4">
						{outro}
					</div>
				)}
			</div>
			{children
				? children
				: buttonProps && (
						<Button asChild size={"lg"} title={buttonTitle} {...rest}>
							{href ? (
								<Link href={href} scroll={buttonProps.scroll}>
									{fullButtonChildren}
								</Link>
							) : (
								fullButtonChildren
							)}
						</Button>
					)}
		</div>
	);
}
