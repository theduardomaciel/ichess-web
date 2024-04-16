import { serverClient } from "@/lib/trpc/server";

// Components
import { Filter } from ".";
import { Suspense } from "react";

export async function PeriodFilter() {
	const { periods } = await serverClient.getPeriods();

	return (
		<Suspense>
			<Filter
				title="Filtrar por período"
				prefix={"periods"}
				items={periods?.map((period) => {
					return { name: period.slug, value: period.slug };
				})}
			/>
		</Suspense>
	);
}
