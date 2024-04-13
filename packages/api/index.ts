import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { eventsRouter } from "./routers/events";
import { createCallerFactory, mergeRouters } from "./trpc";

export const appRouter = mergeRouters(eventsRouter);

export { createCallerFactory };

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
