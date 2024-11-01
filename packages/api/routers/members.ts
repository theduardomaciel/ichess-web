import { db } from "@ichess/drizzle";

import {
	member,
	memberExperiences,
	memberOnEvent,
	memberRoles,
	user,
} from "@ichess/drizzle/schema";
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
import { isMemberAuthenticated } from "../auth";

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
					where: (fields, { eq }) => eq(fields.userId, requestUserId),
				})
				: undefined;

			if (!requestUserId || !requestMember) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not authorized to view this member",
					cause: "You are not a member of this project",
				});
			}

			if (requestMember?.role === "member" && requestUserId !== member.userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not authorized to view this member",
					cause: "You are not the requested member or an admin of this project",
				});
			}

			const periods = await db.query.period.findMany();

			const periodFrom = periods.find(
				(period) =>
					period.from <= member.joinedAt && period.to >= member.joinedAt,
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

			// console.log("periods", periods);

			const { dateFrom, dateTo } = getPeriodsInterval(periods);

			// console.log("dateFrom", dateFrom);
			// console.log("dateTo", dateTo);

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
						asc(member.username),
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
			// console.log("amount", amount);
			// console.log("pageCount", pageCount);

			return {
				members,
				pageCount,
			};
		}),
	updateMembers: protectedProcedure
		.input(
			z.object({
				projectId: z.string().uuid(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { projectId } = input;

			console.log("projectId", projectId);

			try {
				const fetch_data = await fetch("https://secomp.pythonanywhere.com/subscribe/participant");
				const users = await fetch_data.json();

				const data: (typeof user.$inferInsert)[] = [];
				const memberData: (typeof member.$inferInsert)[] = [];

				for (const user_data of users) {
					const email = user_data["email"];

					const randomExperience =
						memberExperiences[Math.floor(Math.random() * memberExperiences.length)];

					data.push({
						id: user_data["id"],
						name: user_data["nome"],
						email,
						emailVerified: new Date(user_data['created_at']),
						image: "https://i.imgur.com/y3xUR5B.png",
						course: "cc",
						registrationId: user_data["id"],
						period: "1",
					});

					memberData.push({
						userId: user_data["id"],
						projectId: projectId,
						username: user_data["email"],
						role: memberRoles["0"],
						experience: randomExperience,
						joinedAt: new Date(user_data['created_at']),
					});
				}

				console.log("🌱 Semeando o banco de dados...");

				await db.insert(user).values(data).onConflictDoNothing();
				await db.insert(member).values(memberData).onConflictDoNothing();

				console.log("✅ Banco de dados semeado com novos membros!");
			} catch (error) {
				console.error("Erro ao atualizar membros", error);
				throw new TRPCError({
					message: "Erro ao atualizar membros",
					code: "INTERNAL_SERVER_ERROR"
				});
			}

			return { success: true };
		}),
	updateMemberPresence: protectedProcedure
		.input(
			z.object({
				eventId: z.string().uuid(),
				verificationCode: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { eventId, verificationCode } = input;
			const memberId = ctx.session.member?.id;

			// Verificamos se o usuário tem permissão para atualizar a presença
			const error = await isMemberAuthenticated({
				projectId: ctx.session.member?.projectId,
				userId: ctx.session.user.id,
			});

			if (error) {
				throw new TRPCError(error);
			}

			if (!memberId) {
				throw new TRPCError({
					message: "Member not found.",
					code: "BAD_REQUEST",
				});
			}

			// Checamos a validade do código de verificação
			const verification = await db.query.verificationToken.findFirst({
				where(fields, { eq }) {
					return and(eq(fields.token, verificationCode));
				},
			});

			const isVerificationValid =
				verification && verification.expires > new Date();

			if (!verification || !isVerificationValid) {
				console.log("verification", verification);
				throw new TRPCError({
					message: "Invalid verification code.",
					code: "BAD_REQUEST",
				});
			}

			// Verificamos se o membro já está presente no evento
			const memberAlreadyPresent = await db.query.memberOnEvent.findFirst({
				where(fields, { and, eq }) {
					return and(
						eq(fields.eventId, eventId),
						eq(fields.memberId, memberId),
					);
				},
			});

			if (memberAlreadyPresent) {
				// return;
				throw new TRPCError({
					message: "Member is already present on the event.",
					code: "BAD_REQUEST",
				});
			}

			// Atualizamos a presença do membro no evento
			await db.insert(memberOnEvent).values({
				eventId,
				memberId,
				joinedAt: new Date(),
			});

			return { success: true };
		}),
});
