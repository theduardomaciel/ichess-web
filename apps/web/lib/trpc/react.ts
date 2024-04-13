import type { AppRouter } from "@ichess/api";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider = trpc.Provider;
