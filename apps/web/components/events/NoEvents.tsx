import { cn } from "@/lib/utils";

interface Props {
	className?: string;
}

export function NoEvents({ className }: Props) {
	return (
		<div
			className={cn(
				"pointer-events-none flex-1 select-none rounded border-2 border-dashed border-primary-200/50 py-5 text-center opacity-50",
				className,
			)}
		>
			<span className="font-title text-xl font-bold text-foreground">
				A definir...
			</span>
		</div>
	);
}
