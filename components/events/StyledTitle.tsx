import { FC, ReactNode } from "react";

interface StyledTitleProps {
	title: ReactNode;
}

export const StyledTitle: FC<StyledTitleProps> = ({ title }) => (
	<div className="relative my-4 h-[3rem]">
		<h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[42px] text-transparent text-stroke-thin text-stroke-neutral/10 font-title font-bold pointer-events-none select-none">
			{title}
		</h1>
		<h1 className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-3xl font-title font-bold">
			{title}
		</h1>
	</div>
);
