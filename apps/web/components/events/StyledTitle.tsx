import { FC, ReactNode } from "react";

interface StyledTitleProps {
	title: ReactNode;
}

export const StyledTitle: FC<StyledTitleProps> = ({ title }) => (
	<div className="relative flex h-12 w-1/2">
		<h2 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-center font-title text-4xl font-bold text-transparent text-stroke-thin text-stroke-neutral/10">
			{title}
		</h2>
		<h2 className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] text-center font-title text-2xl font-bold">
			{title}
		</h2>
	</div>
);
