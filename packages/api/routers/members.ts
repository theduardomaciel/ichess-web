import { db } from "@ichess/drizzle";

import { z } from "zod";

// API
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { member, user } from "@ichess/drizzle/schema";
import { and, desc, eq, getTableColumns } from "@ichess/drizzle/orm";

export const membersRouter = createTRPCRouter({
	getMember: protectedProcedure
		.input(
			z.object({
				memberId: z.string().uuid(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { memberId } = input;

			const member = await db.query.member.findFirst({
				where(fields, { eq }) {
					return eq(fields.id, memberId);
				},
			});

			if (!member) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Member not found",
				});
			}

			const requestUserId = ctx.session?.user.id;

			if (!requestUserId) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You are not authorized to view this member",
				});
			}

			const requestMember = await db.query.member.findFirst({
				where: (fields, { eq }) => eq(fields.userId, requestUserId),
			});

			if (
				requestMember?.role === "member" &&
				requestUserId !== member.userId
			) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not allowed to view this member",
				});
			}

			return {
				member,
			};
		}),

	getMembers: protectedProcedure
		.input(
			z.object({
				projectId: z.string().uuid(),
				search: z.string().optional(),
				sortBy: z.enum(["recent", "oldest"]).optional(),
				page: z.coerce.number().default(0),
				pageSize: z.coerce.number().default(10),
			}),
		)
		.query(async ({ input }) => {
			const { projectId, search, sortBy, page, pageSize } = input;

			const members = await db
				.select({
					...getTableColumns(member),
					...getTableColumns(user),
				})
				.from(member)
				.leftJoin(user, eq(member.userId, user.id))
				.where(
					and(
						eq(member.projectId, projectId),
						search ? eq(user.name, search) : undefined,
					),
				)
				.orderBy(
					member.joinedAt,
					sortBy && sortBy === "recent"
						? desc(member.joinedAt)
						: member.joinedAt,
				)
				.limit(pageSize)
				.offset(page * pageSize);

			return {
				members,
			};
		}),
});
