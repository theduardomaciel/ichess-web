import { db } from "@ichess/drizzle";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { verificationToken } from "@ichess/drizzle/schema";
import { eq } from "@ichess/drizzle/orm";

const DEFAULT_CHARACTERS_AMOUNT = 6;
const DEFAULT_LIFETIME = 30000;

export const verificationCodesRouter = createTRPCRouter({
	getVerificationCode: protectedProcedure
		.input(
			z.object({
				charactersAmount: z.number().nullable().optional(),
				lifetime: z.number().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { charactersAmount, lifetime } = input;
			const userId = ctx.session.user.id;

			if (!userId) {
				throw new Error("User not found");
			}

			if (ctx.session.member?.role !== "admin") {
				throw new Error("User is not an admin");
			}

			if (charactersAmount && charactersAmount < 1) {
				throw new Error("Characters amount must be greater than 0");
			}

			const userTokens = await db
				.select()
				.from(verificationToken)
				.where(eq(verificationToken.identifier, userId));

			if (userTokens.length) {
				for (const token of userTokens) {
					if (token.expires.getTime() < Date.now()) {
						await db
							.delete(verificationToken)
							.where(eq(verificationToken.token, token.token));
					}
				}
			}

			const code = Array.from(
				{ length: charactersAmount || DEFAULT_CHARACTERS_AMOUNT },
				() => Math.floor(Math.random() * 10),
			);

			const codeString = code.join("");
			const expireDate = new Date(Date.now() + (lifetime || DEFAULT_LIFETIME));

			try {
				await db.insert(verificationToken).values({
					expires: expireDate,
					token: codeString,
					identifier: userId,
				});
			} catch (error) {
				console.error("Error inserting verification token:", error);
				throw new Error("Error generating verification code");
			}

			return {
				code: codeString,
				expires: expireDate,
			};
		}),
});
