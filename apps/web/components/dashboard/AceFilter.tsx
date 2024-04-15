import { serverClient } from "@/lib/trpc/server";

// Components
import { Filter } from "./Filter";
import { Suspense } from "react";

export async function AceFilter() {
	const { aces } = await serverClient.getAces();

	return (
		<Suspense fallback={<>carregando aces...</>}>
			<Filter
				title="Filtrar por ACE"
				prefix={"acesFilter"}
				items={aces?.map((ace) => ({
					name: ace.description,
					value: ace.id.toString(),
				}))}
				linesAmount={2}
			/>
		</Suspense>
	);
}
