import { db } from "@ichess/drizzle";
import { env } from "@ichess/env";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
	member,
	memberExperiences,
	user,
	userCourses,
	userPeriods,
} from "@ichess/drizzle/schema";
import { eq } from "@ichess/drizzle/orm";
import { unstable_update } from "@ichess/auth";

export const usersRouter = createTRPCRouter({
	updateUser: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				course: z.enum(userCourses),
				registrationId: z.string(),
				period: z.enum(userPeriods),
				experience: z.enum(memberExperiences),
				username: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session?.user.id;

			const { name, course, registrationId, period, experience, username } =
				input;

			if (!userId) {
				throw new Error("User not found.");
			}

			// First we update the user
			await db
				.update(user)
				.set({
					name,
					course,
					registrationId,
					period,
				})
				.where(eq(user.id, userId));

			// Then we create the member
			const createdMember = await db
				.insert(member)
				.values({
					userId,
					username,
					experience,
					role: "admin",
					projectId: env.PROJECT_ID,
				})
				.returning({
					id: member.id,
					role: member.role,
				});

			if (createdMember[0]) {
				await unstable_update({
					user: {
						...ctx.session.user,
						name,
						course,
						registrationId,
						period,
					},
					member: {
						id: createdMember[0].id,
						username,
						projectId: env.PROJECT_ID,
						role: "admin",
					},
				});
			}
		}),
});
