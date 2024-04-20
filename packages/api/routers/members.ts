import { db } from "@ichess/drizzle";

import { member, memberRoles, user } from "@ichess/drizzle/schema";
import {
	and,
	asc,
	count,
	desc,
	eq,
	getTableColumns,
	gte,
	ilike,
	inArray,
	lte,
	or,
} from "@ichess/drizzle/orm";

// Validation
import { z } from "zod";
import { getPeriodsInterval, transformSingleToArray } from "../utils";

// API
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const getMembersParams = z.object({
	projectId: z.string().uuid(),
	search: z.string().optional(),
	role: z.enum(memberRoles).optional(),
	periods: z
		.union([z.array(z.string()), z.string()])
		.transform(transformSingleToArray)
		.optional(),
	sortBy: z.enum(["recent", "oldest"]).optional(),
	page: z.coerce.number().default(0),
	pageSize: z.coerce.number().default(10),
});

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

			console.log("requestUserId", requestUserId);

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

	getMembers: publicProcedure
		.input(getMembersParams)
		.query(async ({ input }) => {
			const {
				projectId,
				role,
				sortBy,
				search,
				page: pageIndex,
				periods: periodsFilter,
				pageSize,
			} = input;

			const periods =
				periodsFilter && periodsFilter.length > 0
					? await db.query.period.findMany({
							where(fields) {
								return inArray(fields.slug, periodsFilter);
							},
						})
					: undefined;

			console.log("periods", periods);

			const { dateFrom, dateTo } = getPeriodsInterval(periods);

			console.log("dateFrom", dateFrom);
			console.log("dateTo", dateTo);

			const [members, [{ amount }]] = await Promise.all([
				await db
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
							search
								? or(
										ilike(user.name, `%${search}%`),
										ilike(member.username, `%${search}%`),
									)
								: undefined,
							dateFrom && dateTo
								? and(
										gte(member.joinedAt, dateFrom),
										lte(member.joinedAt, dateTo),
									)
								: undefined,
							role ? eq(member.role, role) : undefined,
						),
					)
					.orderBy(
						member.joinedAt,
						sortBy && sortBy === "oldest"
							? asc(member.joinedAt)
							: desc(member.joinedAt),
					)
					.limit(pageSize)
					.offset(pageIndex ? (pageIndex - 1) * pageSize : 0),
				db
					.select({ amount: count() })
					.from(member)
					.leftJoin(user, eq(member.userId, user.id))
					.where(
						and(
							eq(member.projectId, projectId),
							search
								? or(
										ilike(user.name, `%${search}%`),
										ilike(member.username, `%${search}%`),
									)
								: undefined,
							role ? eq(member.role, role) : undefined,
						),
					),
			]);

			const pageCount = Math.ceil(amount / pageSize);
			console.log("amount", amount);
			console.log("pageCount", pageCount);

			return {
				members,
				pageCount,
			};
		}),
});
