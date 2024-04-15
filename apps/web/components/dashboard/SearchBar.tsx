"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

// Icons
import { X } from "lucide-react";
import SearchIcon from "@/public/icons/search.svg";

// Components
import { Input } from "@/components/ui/input";

// Utils
import { useQueryString } from "@/hooks/use-query-string";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function SearchBar({ className, onChange, ...props }: SearchBarProps) {
	const router = useRouter();
	const { query, toUrl } = useQueryString();

	const [value, setValue] = useState(query.get("search") || "");

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			router.push(
				toUrl(
					value
						? { search: value, page: undefined }
						: { search: undefined },
				),
			);
		}, 250);

		return () => clearTimeout(delayDebounce);
	}, [value, toUrl, router]);

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
			{value && (
				<X
					className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted"
					onClick={() => {
						setValue("");
						router.push(toUrl({ search: undefined }));
					}}
				/>
			)}
		</div>
	);
}
