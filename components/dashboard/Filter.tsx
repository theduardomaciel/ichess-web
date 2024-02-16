"use client";

import { useQueryString } from "@/hooks/use-query-string";

// Icons
import ChevronUp from "@/public/icons/chevron_up.svg";

// Components
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";

interface FilterProps {
	title: string;
	items: {
		name: string;
		value: string;
	}[];
}

const MAX_VISIBLE_FILTERS = 4;

export function Filter({ title, items }: FilterProps) {
	const router = useRouter();
	const { query, setQuery, deleteQuery, toUrl } = useQueryString();

	const filters = query.get("filters")?.split(",") ?? [];

	const handleFilterChange = (value: string, checked: boolean) => {
		const newFilters = checked
			? [...filters, value]
			: filters.filter((f) => f !== value);

		if (newFilters.length === 0) {
			deleteQuery("filters");
		}

		router.push(toUrl(setQuery("filters", newFilters.join(","))), {
			scroll: false,
		});
	};

	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="flex flex-col justify-center items-start gap-4">
			<p className="text-center text-neutral text-sm font-medium">
				{title}
			</p>
			<ul
				className={cn(
					"flex flex-col justify-start items-start gap-4 overflow-hidden max-h-[50rem] transition-[max-height] duration-300 ease-in-out",
					{
						"max-h-[190px]": !isExpanded,
					}
				)}
			>
				{items.map((item, index) => (
					<li
						key={index}
						className="flex justify-center items-center gap-2"
					>
						<Checkbox
							id={item.value}
							name={item.name}
							value={item.value}
							checked={filters.includes(item.value)}
							onCheckedChange={(checked) => {
								handleFilterChange(
									item.value,
									checked === "indeterminate"
										? false
										: checked
								);
							}}
						/>
						<Label htmlFor={item.value}>{item.name}</Label>
					</li>
				))}
			</ul>
			{
				// If the amount of filters is greater than the MAX_VISIBLE_FILTERS
				// we show the "ExpandMore" button
				items.length > MAX_VISIBLE_FILTERS && (
					<ExpandMore
						isExpanded={isExpanded}
						setIsExpanded={setIsExpanded}
					/>
				)
			}
		</div>
	);
}

function ExpandMore({
	isExpanded,
	setIsExpanded,
}: {
	isExpanded: boolean;
	setIsExpanded: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<button
			className="flex flex-row items-center justify-start gap-4 text-sm"
			onClick={() => setIsExpanded((prev) => !prev)}
		>
			<ChevronUp
				className="transition-transform"
				style={{
					transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
				}}
			/>
			Ver {isExpanded ? "menos" : "mais"}
		</button>
	);
}
