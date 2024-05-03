import { db } from "@ichess/drizzle";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const verificationCodesRouter = createTRPCRouter({
	getVerificationCodes: protectedProcedure.query(async () => {
		const verificationCodes = await db.query.ace.findMany();

		return {
			verificationCodes,
		};
	}),

	getVerificationCode: protectedProcedure
		.input(
			z.object({
				aceId: z.number().int(),
			}),
		)
		.query(async ({ input }) => {
			const { aceId } = input;

			const ace = await db.query.ace.findFirst({
				where(fields, { eq }) {
					return eq(fields.id, aceId);
				},
			});

			return {
				ace,
			};
		}),
});
