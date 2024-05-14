import { Skeleton } from "@/components/ui/skeleton";

export function MemberCardSkeleton() {
	return (
		<>
			<div className="flex flex-col items-center justify-start gap-6">
				<Skeleton className="h-32 w-32 rounded-2xl" />
				<div className="flex flex-col items-center justify-start gap-1">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-2 w-16" />
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-6">
				<ul className="flex flex-col flex-wrap items-center justify-center gap-2 sm:max-w-[70%] sm:flex-row">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-4 w-32" />
				</ul>
				<ul className="flex w-full flex-col items-center justify-start gap-2">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</ul>
			</div>
			<div className="flex flex-col items-center justify-start gap-2">
				<Skeleton className="h-12 w-full" />
			</div>
		</>
	);
}
