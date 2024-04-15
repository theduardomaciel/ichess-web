"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useQueryString } from "@/hooks/use-query-string";

// Components
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SortBy({ sortBy }: { sortBy?: string }) {
	const router = useRouter();
	const { toUrl } = useQueryString();

	const onValueChange = useCallback(
		(value: string) => {
			router.push(toUrl({ sortBy: value }));
		},
		[router, toUrl],
	);

	return (
		<Select value={sortBy ?? "recent"} onValueChange={onValueChange}>
			<SelectTrigger className="w-44">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="recent">Mais recentes</SelectItem>
				<SelectItem value="oldest">Mais antigos</SelectItem>
			</SelectContent>
		</Select>
	);
}
