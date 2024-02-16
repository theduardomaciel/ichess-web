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
	prefix: string;
	items: {
		name: string;
		value: string;
	}[];
	linesAmount?: number;
}

const MAX_VISIBLE_FILTERS = 2;
const ITEM_HEIGHT = 40;
const GAP = 16;

const heightFormula = (linesAmount: number) => {
	// A função ainda possui um bug: quando o usuário diminui muito o zoom, o texto do filtro passa a ocupar somente uma linha, mas o cálculo da altura não é atualizado
	return (
		(ITEM_HEIGHT + GAP) * MAX_VISIBLE_FILTERS - GAP * (linesAmount - 1 / 2)
	);
};

export function Filter({ title, prefix, items, linesAmount = 1 }: FilterProps) {
	const router = useRouter();
	const { query, setQuery, deleteQuery, toUrl } = useQueryString();

	const filters = query.get(prefix)?.split(",") ?? [];

	const handleFilterChange = (value: string, checked: boolean) => {
		const newFilters = checked
			? [...filters, value]
			: filters.filter((f) => f !== value);

		if (newFilters.length === 0) {
			router.push(toUrl(deleteQuery(prefix)), { scroll: false });
		} else {
			router.push(toUrl(setQuery(prefix, newFilters.join(","))), {
				scroll: false,
			});
		}
	};

	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="flex flex-col justify-center items-start gap-4">
			<p className="text-center text-neutral text-sm font-medium">
				{title}
			</p>
			<ul
				className={
					"flex flex-col justify-start items-start gap-4 overflow-hidden max-h-[50rem] transition-[max-height] duration-300 ease-in-out"
				}
				style={{
					maxHeight: isExpanded
						? `${ITEM_HEIGHT * items.length * linesAmount}px`
						: `${
								heightFormula(linesAmount)
								// para linesAmount = 1 -> GAP / 2
								// para linesAmount = 2 -> GAP * 2
								// Como tornar isso em uma fórmula?
						  }px`,
				}}
			>
				{items.map((item, index) => (
					<li
						key={index}
						className={
							"flex justify-start items-center gap-2 w-full"
						}
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
						<Label
							className="lg:text-sm leading-tight text-ellipsis overflow-hidden line-clamp-2"
							style={{
								maxHeight: ITEM_HEIGHT - 4,
							}}
							htmlFor={item.value}
						>
							{item.name}
						</Label>
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
