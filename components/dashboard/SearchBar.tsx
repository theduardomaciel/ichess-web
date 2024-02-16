"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Icons
import SearchIcon from "@/public/icons/search.svg";

// Components
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQueryString } from "@/hooks/use-query-string";
import { X } from "lucide-react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function SearchBar({
	className,
	onChange,
	...props
}: SearchBarProps) {
	const router = useRouter();
	const { query, setQuery, deleteQuery, toUrl } = useQueryString();

	const [value, setValue] = useState(query.get("search") || "");

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			let params;

			if (value) {
				params = setQuery("search", value);

				params = deleteQuery("page", params);
			} else {
				params = deleteQuery("search");
			}

			router.push(toUrl(params));
		}, 250);

		return () => clearTimeout(delayDebounce);
	}, [value]);

	return (
		<div className="w-full relative">
			<SearchIcon className="absolute w-4 h-4 left-4 top-1/2 -translate-y-1/2 text-muted" />
			<Input
				className={cn("pl-12 lg:pl-12", className)}
				value={value}
				onChange={(e) => {
					if (onChange) onChange(e);
					setValue(e.target.value);
				}}
				{...props}
			/>
			{value && (
				<X
					className="absolute w-4 h-4 right-4 top-1/2 -translate-y-1/2 text-muted cursor-pointer"
					onClick={() => {
						setValue("");
						router.push(toUrl(deleteQuery("search")));
					}}
				/>
			)}
		</div>
	);
}
