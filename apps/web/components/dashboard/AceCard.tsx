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
				"inline-flex flex-row flex-wrap items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-300 px-6 py-3",
				className,
			)}
		>
			<div className="inline-flex items-center justify-start gap-4 self-stretch">
				<AceIcon />
				<p className="shrink grow basis-0 text-base font-medium text-neutral">
					{ace.name}
				</p>
			</div>
			<div className="inline-flex items-center justify-end gap-2">
				<TimeIcon />
				<p className="text-left text-base font-medium text-neutral">
					{ace.hours}h
				</p>
			</div>
		</div>
	);
}

export function AceLabel({ ace }: { ace: (typeof ACEs)[number] }) {
	return (
		<div className="flex flex-row items-center justify-start gap-4">
			<AceIcon className="min-w-fit text-neutral" />
			<p className="text-left text-sm leading-tight lg:text-base">
				{ace.description}
			</p>
		</div>
	);
}
