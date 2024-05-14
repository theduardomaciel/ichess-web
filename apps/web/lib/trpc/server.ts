import "server-only";

import { auth } from "@ichess/auth";
import { appRouter, createCallerFactory } from "@ichess/api";

export const serverClient = createCallerFactory(appRouter)(async () => {
	const session = await auth();

	return { session };
});
