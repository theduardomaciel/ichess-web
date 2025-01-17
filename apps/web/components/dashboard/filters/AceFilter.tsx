import { serverClient } from "@/lib/trpc/server";

// Components
import { Filter } from "./Filter";
import { Suspense } from "react";

export async function AceFilter() {
	const { aces } = await serverClient.getAces();

	return (
		<Suspense>
			<Filter
				title="Filtrar por ACE"
				prefix={"aces"}
				items={aces?.map((ace) => ({
					name: ace.name,
					value: ace.id.toString(),
				}))}
				config={{
					linesAmount: 2,
				}}
			/>
		</Suspense>
	);
}
