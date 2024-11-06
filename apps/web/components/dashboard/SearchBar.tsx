"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

// Icons
import { Loader2, X } from "lucide-react";
import SearchIcon from "@/public/icons/search.svg";

// Components
import { Input } from "@/components/ui/input";

// Hooks
import { useQueryString } from "@/hooks/use-query-string";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
	tag?: string;
	word?: string;
}

export function SearchBar({
	className,
	word = "search",
	onChange,
	tag,
	...props
}: SearchBarProps) {
	const router = useRouter();
	const { query, toUrl } = useQueryString();

	const [isPendingSearchTransition, startTransition] = useTransition();

	const [value, setValue] = useState(query.get(word) || "");
	const debouncedValue = useDebounce(value, 250);

	useEffect(() => {
		startTransition(() => {
			router.push(
				toUrl(
					debouncedValue
						? { [word]: debouncedValue, page: undefined }
						: { [word]: undefined },
				),
				{
					scroll: false,
				},
			);
		});
	}, [debouncedValue, toUrl, router]);

	return (
		<div className="relative w-full">
			<SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
			<Input
				className={cn("px-12 lg:px-12", className, {
					"py-[1.1rem]": !!tag,
				})}
				value={value}
				onChange={(e) => {
					if (onChange) onChange(e);
					setValue(e.target.value);
				}}
				{...props}
			/>

			<div
				className={
					"absolute right-4 top-1/2 flex -translate-y-1/2 flex-row items-center justify-end gap-2"
				}
			>
				{isPendingSearchTransition ? (
					<Loader2 className="h-4 w-4 origin-center animate-spin text-muted" />
				) : value ? (
					<X
						className="h-4 w-4 cursor-pointer text-muted"
						onClick={() => {
							setValue("");
							router.push(toUrl({ [word]: undefined }));
						}}
					/>
				) : null}
				{tag && (
					<div className="pointer-events-none hidden md:flex select-none rounded-sm bg-gray-200 px-2.5 py-1 -mr-2">
						<span className="text-muted text-sm">{tag}</span>
					</div>
				)}
			</div>
		</div>
	);
}
