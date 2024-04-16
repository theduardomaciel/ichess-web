"use client";

import {
	Dispatch,
	SetStateAction,
	useRef,
	useState,
	useTransition,
} from "react";
import { useQueryString } from "@/hooks/use-query-string";
import { useRouter } from "next/navigation";

// Icons
import ChevronUp from "@/public/icons/chevron_up.svg";

// Components
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Utils
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
	const { query, toUrl } = useQueryString();

	const [isExpanded, setIsExpanded] = useState(false);

	const [isPendingFilterTransition, startTransition] = useTransition();

	const [filters, setFilters] = useState<string[]>(
		query.getAll(prefix) ?? [],
	);

	const hasDebounce = useRef(false);

	const handleFilterChange = (value: string, checked: boolean) => {
		const newFilters: string[] | undefined = checked
			? [...filters, value]
			: filters.filter((f) => f !== value);

		setFilters(newFilters);

		const delayDebounce = setTimeout(() => {
			if (hasDebounce.current) {
				console.log("Filtrando...");
				startTransition(() => {
					router.push(
						toUrl({
							[`${prefix}`]:
								filters.length === 0 ? undefined : filters,
						}),
						{
							scroll: false,
						},
					);
				});
			}
			hasDebounce.current = false;
			clearTimeout(delayDebounce);
		}, 1000);

		hasDebounce.current = true;
	};

	return (
		<div className="flex flex-col items-start justify-center gap-4">
			<p className="text-center text-sm font-medium text-neutral">
				{title}
			</p>
			<ul
				className={
					"flex max-h-[50rem] flex-col items-start justify-start gap-4 overflow-hidden transition-[max-height] duration-300 ease-in-out"
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
						className={cn(
							"flex w-full items-center justify-start gap-2",
							{
								"pointer-events-none select-none opacity-50":
									isPendingFilterTransition,
							},
						)}
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
										: checked,
								);
							}}
						/>
						<Label
							className="line-clamp-2 overflow-hidden text-ellipsis leading-tight lg:text-sm"
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
