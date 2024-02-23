import { FC, ReactNode } from "react";

interface StyledTitleProps {
	title: ReactNode;
}

export const StyledTitle: FC<StyledTitleProps> = ({ title }) => (
	<div className="relative my-4 h-[3rem]">
		<h2 className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-center text-5xl text-transparent text-stroke-thin text-stroke-[#808080] font-title font-bold">
			{title}
		</h2>
		<h2 className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-center text-3xl font-title font-bold">
			{title}
		</h2>
	</div>
);