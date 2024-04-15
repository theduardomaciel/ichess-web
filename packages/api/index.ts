import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { eventsRouter } from "./routers/events";
import { acesRouter } from "./routers/aces";
import { periodsRouter } from "./routers/periods";

import { createCallerFactory, mergeRouters } from "./trpc";

export const appRouter = mergeRouters(eventsRouter, acesRouter, periodsRouter);

export { createCallerFactory };

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
