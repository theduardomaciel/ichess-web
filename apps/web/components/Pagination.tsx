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
	currentPage: number;
	pageCount: number;
}

const MAX_PAGINATION_PAGES = 2;

export function PagesDisplay({ currentPage, pageCount }: Props) {
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
						href={toUrl({ page: (currentPage - 1).toString() })}
						className={cn({
							"pointer-events-none opacity-50": !canGoBack,
						})}
					/>
				</PaginationItem>
				{Array.from(
					{ length: Math.min(pageCount, MAX_PAGINATION_PAGES) },
					(_, i) => (
						// biome-ignore lint: the index is used as page number
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
						href={toUrl({ page: (currentPage + 1).toString() })}
						className={cn({
							"pointer-events-none opacity-50": !canGoForward,
						})}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
