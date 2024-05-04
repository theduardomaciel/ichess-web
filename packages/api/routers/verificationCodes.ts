import { db } from "@ichess/drizzle";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { verificationToken } from "@ichess/drizzle/schema";

const DEFAULT_CHARACTERS_AMOUNT = 6;
const DEFAULT_LIFETIME = 30000;

export const verificationCodesRouter = createTRPCRouter({
	getVerificationCode: protectedProcedure
		.input(
			z.object({
				charactersAmount: z.number().optional(),
				lifetime: z.number().optional(),
			}),
		)
		.query(async ({ input }) => {
			const { charactersAmount } = input;

			const code = Array.from(
				{ length: charactersAmount || DEFAULT_CHARACTERS_AMOUNT },
				() => Math.floor(Math.random() * 10),
			);

			const codeString = code.join("");
			const expireDate = new Date(
				Date.now() + (input.lifetime || DEFAULT_LIFETIME),
			);

			await db.insert(verificationToken).values({
				expiresAt: expireDate,
				token: codeString,
				identifier: "verification",
			});

			return codeString;
		}),
});
