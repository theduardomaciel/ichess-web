import { db } from "@ichess/drizzle";

import { z } from "zod";

// API
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { member, memberRoles, user } from "@ichess/drizzle/schema";
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
				with: {
					user: {
						columns: {
							name: true,
							image: true,
							email: true,
						},
					},
					membersOnEvent: {
						with: {
							event: {
								with: {
									ace: {
										columns: {
											hours: true,
										},
									},
								},
							},
						},
					},
				},
			});

			if (!member) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Member not found",
				});
			}

			const requestUserId = ctx.session?.user.id;

			const requestMember = requestUserId
				? await db.query.member.findFirst({
						where: (fields, { eq }) =>
							eq(fields.userId, requestUserId),
					})
				: undefined;

			if (!requestUserId || !requestMember) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not authorized to view this member",
					cause: "You are not a member of this project",
				});
			}

			if (
				requestMember?.role === "member" &&
				requestUserId !== member.userId
			) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not authorized to view this member",
					cause: "You are not the requested member or an admin of this project",
				});
			}

			const periods = await db.query.period.findMany();

			const periodFrom = periods.find(
				(period) =>
					period.from <= member.joinedAt &&
					period.to >= member.joinedAt,
			);

			const totalHours = member.membersOnEvent.reduce(
				(total, { event }) => total + event.ace.hours,
				0,
			);

			return {
				member,
				period: periodFrom?.slug,
				hours: totalHours,
				requestClientRole: requestMember.role,
			};
		}),

	getMembers: protectedProcedure
		.input(
			z.object({
				projectId: z.string().uuid(),
				search: z.string().optional(),
				role: z.enum(memberRoles).optional(),
				sortBy: z.enum(["recent", "oldest"]).optional(),
				page: z.coerce.number().default(0),
				pageSize: z.coerce.number().default(10),
			}),
		)
		.query(async ({ input }) => {
			const { projectId, search, role, sortBy, page, pageSize } = input;

			const members = await db
				.select({
					...getTableColumns(member),
					user: {
						name: user.name,
						image: user.image,
					},
				})
				.from(member)
				.leftJoin(user, eq(member.userId, user.id))
				.where(
					and(
						eq(member.projectId, projectId),
						search ? eq(user.name, search) : undefined,
						role ? eq(member.role, role) : undefined,
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
