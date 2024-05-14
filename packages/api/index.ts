import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// Routers
import { eventsRouter } from "./routers/events";
import { acesRouter } from "./routers/aces";
import { periodsRouter } from "./routers/periods";
import { membersRouter } from "./routers/members";
import { verificationCodesRouter } from "./routers/verificationCodes";

import { createCallerFactory, mergeRouters } from "./trpc";
import { usersRouter } from "./routers/users";

export const appRouter = mergeRouters(
	eventsRouter,
	acesRouter,
	periodsRouter,
	membersRouter,
	usersRouter,
	verificationCodesRouter,
);

export { createCallerFactory };

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
