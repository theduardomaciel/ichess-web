// Icons
import AceIcon from "@/public/icons/ace.svg";
import TimeIcon from "@/public/icons/time.svg";

// Types
import { ACEs } from "@/lib/validations/AddEventForm";
import { cn } from "@/lib/utils";

interface AceCardProps {
	className?: string;
	ace: (typeof ACEs)[number];
}

export function AceCard({ className, ace }: AceCardProps) {
	return (
		<div
			className={cn(
				"px-6 py-3 bg-gray-300 rounded-lg border border-gray-200 flex-row flex-wrap justify-between items-start gap-4 inline-flex",
				className
			)}
		>
			<div className="self-stretch justify-start items-center gap-4 inline-flex">
				<AceIcon />
				<p className="grow shrink basis-0 text-neutral text-base font-medium">
					{ace.name}
				</p>
			</div>
			<div className="justify-end items-center gap-2 inline-flex">
				<TimeIcon />
				<p className="text-left text-neutral text-base font-medium">
					{ace.hours}h
				</p>
			</div>
		</div>
	);
}

export function AceLabel({ ace }: { ace: (typeof ACEs)[number] }) {
	return (
		<div className="flex flex-row items-center justify-start gap-4">
			<AceIcon className="text-neutral min-w-fit" />
			<p className="text-left leading-tight text-sm lg:text-base">
				{ace.name}
			</p>
		</div>
	);
}
