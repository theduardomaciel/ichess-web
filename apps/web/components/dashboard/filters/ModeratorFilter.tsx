"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

// Components
import { ModeratorPicker } from "@/components/dashboard/ModeratorPicker";

// Hooks
import { useQueryString } from "@/hooks/use-query-string";

// Utils
import { cn } from "@/lib/utils";

interface Params {
	projectId: string;
}

export function ModeratorFilter({ projectId }: Params) {
	const router = useRouter();
	const { query, toUrl } = useQueryString();

	const initialModerators = query.get("moderators")?.split(",") || [];
	const [isPendingFilterTransition, startTransition] = useTransition();

	const onSelect = useCallback(
		(moderatorsIds: string[]) => {
			console.log("Selected moderators:", moderatorsIds);

			startTransition(() => {
				router.push(
					toUrl({
						moderators:
							moderatorsIds.length === 0
								? undefined
								: moderatorsIds.join(","),
					}),
					{
						scroll: false,
					},
				);
			});
		},
		[router, toUrl],
	);

	return (
		<ModeratorPicker
			className={cn({
				"pointer-events-none animate-pulse": isPendingFilterTransition,
			})}
			initialModerators={initialModerators}
			projectId={projectId}
			onSelect={onSelect}
		/>
	);
}
