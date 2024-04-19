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

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function SearchBar({ className, onChange, ...props }: SearchBarProps) {
	const router = useRouter();
	const { query, toUrl } = useQueryString();

	const [isPendingSearchTransition, startTransition] = useTransition();

	const [value, setValue] = useState(query.get("search") || "");
	const debouncedValue = useDebounce(value, 250);

	useEffect(() => {
		startTransition(() => {
			router.push(
				toUrl(
					debouncedValue
						? { search: debouncedValue, page: undefined }
						: { search: undefined },
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
				className={cn("px-12 lg:px-12", className)}
				value={value}
				onChange={(e) => {
					if (onChange) onChange(e);
					setValue(e.target.value);
				}}
				{...props}
			/>

			{isPendingSearchTransition ? (
				<div className="absolute right-4 top-1/2 -translate-y-1/2">
					<Loader2 className="h-4 w-4 origin-center animate-spin text-muted" />
				</div>
			) : value ? (
				<X
					className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted"
					onClick={() => {
						setValue("");
						router.push(toUrl({ search: undefined }));
					}}
				/>
			) : null}
		</div>
	);
}
