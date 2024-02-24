import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface Props {
	pathname: string;
	searchParams: { [key: string]: string };
	total: number;
	perPage: number;
}

const MAX_PAGINATION_PAGES = 5;

export function DashboardPagination({
	pathname,
	searchParams,
	total,
	perPage,
}: Props) {
	const PAGES_AMOUNT = Math.ceil(total / perPage);

	// Remove the page parameter from the search params
	const searchParamsWithoutPage = { ...searchParams };
	delete searchParamsWithoutPage.page;

	// We check if the searchParams object is empty
	// If it is, we don't append the "?" to the URL
	const searchParamsKeys = Object.keys(searchParamsWithoutPage);

	const currentURL = `${pathname}?${new URLSearchParams(
		searchParamsWithoutPage
	)}${searchParamsKeys.length > 0 ? "&" : ""}page=`;

	const currentPage = !isNaN(Number(searchParams.page))
		? Number(searchParams.page)
		: 1;

	const canGoBack = currentPage > 1;
	const canGoForward = currentPage < PAGES_AMOUNT;

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
						href={`${currentURL}${currentPage - 1}`}
						className={cn({
							"pointer-events-none opacity-50": !canGoBack,
						})}
					/>
				</PaginationItem>
				{Array.from(
					{ length: Math.min(PAGES_AMOUNT, MAX_PAGINATION_PAGES) },
					(_, i) => (
						<PaginationItem key={i}>
							<PaginationLink
								href={`${currentURL}${i + 1}`}
								isActive={currentPage === i + 1}
							>
								{i + 1}
							</PaginationLink>
						</PaginationItem>
					)
				)}
				{PAGES_AMOUNT > MAX_PAGINATION_PAGES && (
					<>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink
								href={`${currentURL}${PAGES_AMOUNT}`}
								isActive={currentPage === PAGES_AMOUNT}
							>
								{PAGES_AMOUNT}
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
						href={`${currentURL}${currentPage + 1}`}
						className={cn({
							"pointer-events-none opacity-50": !canGoForward,
						})}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
