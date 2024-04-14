import { db } from "@ichess/drizzle";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const acesRouter = createTRPCRouter({
	getAces: protectedProcedure.query(async () => {
		const aces = await db.query.ace.findMany();

		return {
			aces,
		};
	}),

	getAce: protectedProcedure
		.input(z.number().int())
		.query(async ({ input }) => {
			const ace = await db.query.ace.findFirst({
				where(fields, { eq }) {
					return eq(fields.id, input);
				},
			});

			return {
				ace,
			};
		}),
});