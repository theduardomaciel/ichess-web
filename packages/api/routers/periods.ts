import { db } from "@ichess/drizzle";

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const periodsRouter = createTRPCRouter({
	getPeriods: publicProcedure.query(async () => {
		const periods = await db.query.period.findMany();

		return {
			periods,
		};
	}),

	getPeriod: publicProcedure
		.input(
			z.object({
				periodId: z.string().min(1),
			}),
		)
		.query(async ({ input }) => {
			const { periodId } = input;

			const period = await db.query.period.findFirst({
				where(fields, { eq }) {
					return eq(fields.slug, periodId);
				},
			});

			return {
				period,
			};
		}),
});
