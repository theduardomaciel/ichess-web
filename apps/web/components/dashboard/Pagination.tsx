"use client";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryString } from "@/hooks/use-query-string";
import { cn } from "@/lib/utils";

interface Props {
	pathname: string;
	currentPage: number;
	pageCount: number;
}

const MAX_PAGINATION_PAGES = 5;

export function DashboardPagination({
	pathname,
	currentPage,
	pageCount,
}: Props) {
	const { toUrl } = useQueryString();

	const canGoBack = currentPage > 1;
	const canGoForward = currentPage < pageCount;

	return (
		<Pagination>
			<PaginationContent className="w-full items-center justify-center">
				<PaginationItem
					style={{
						cursor: canGoBack ? "pointer" : "not-allowed",
					}}
				>
					<PaginationPrevious
						size={"icon"}
						href={`${pathname}${currentPage - 1}`}
						className={cn({
							"pointer-events-none opacity-50": !canGoBack,
						})}
					/>
				</PaginationItem>
				{Array.from(
					{ length: Math.min(pageCount, MAX_PAGINATION_PAGES) },
					(_, i) => (
						<PaginationItem key={i}>
							<PaginationLink
								href={toUrl({ page: (i + 1).toString() })}
								isActive={currentPage === i + 1}
							>
								{i + 1}
							</PaginationLink>
						</PaginationItem>
					),
				)}
				{pageCount > MAX_PAGINATION_PAGES && (
					<>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink
								href={toUrl({ page: pageCount.toString() })}
								isActive={currentPage === pageCount}
							>
								{pageCount}
							</PaginationLink>
						</PaginationItem>
					</>
				)}
				<PaginationItem
					style={{
						cursor: canGoForward ? "pointer" : "not-allowed",
					}}
				>
					<PaginationNext
						size={"icon"}
						href={`${pathname}${currentPage + 1}`}
						className={cn({
							"pointer-events-none opacity-50": !canGoForward,
						})}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
