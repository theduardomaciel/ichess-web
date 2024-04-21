import { db } from "@ichess/drizzle";
import {
	ace,
	event,
	eventTypes,
	member,
	memberOnEvent,
	user,
} from "@ichess/drizzle/schema";
import {
	getMembersIdsToMutate,
	getPeriodsInterval,
	transformSingleToArray,
} from "../utils";
import {
	and,
	desc,
	eq,
	inArray,
	gte,
	lte,
	or,
	ilike,
	asc,
	getTableColumns,
	countDistinct,
} from "@ichess/drizzle/orm";
import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const getEventsParams = z.object({
	search: z.string().optional(),
	sortBy: z.enum(["recent", "oldest"]).optional(),
	page: z.coerce.number().default(0),
	pageSize: z.coerce.number().default(10),
	periods: z
		.union([z.array(z.string()), z.string()])
		.transform(transformSingleToArray)
		.optional(),
	aces: z
		.union([z.array(z.string()), z.string()])
		.transform(transformSingleToArray)
		.optional(),
	moderators: z
		.union([z.array(z.string()), z.string()])
		.transform(transformSingleToArray)
		.optional(),
});

const mutateEventParams = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	dateFrom: z.date(),
	dateTo: z.date(),
	membersIds: z
		.union([z.array(z.string()), z.string()])
		.transform((value) => {
			return Array.isArray(value) ? value : [value];
		}),
	type: z.enum(eventTypes),
	aceId: z.string().transform((value) => Number(value)),
});

export const eventsRouter = createTRPCRouter({
	getEvent: protectedProcedure
		.input(
			z.object({
				eventId: z.string().uuid(),
				projectId: z.string().uuid(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { eventId, projectId } = input;

			const userId = ctx.session.user.id;

			if (!userId) {
				throw new TRPCError({
					message: "User not found.",
					code: "BAD_REQUEST",
				});
			}

			const member = await db.query.member.findFirst({
				where(fields) {
					return and(
						eq(fields.projectId, projectId),
						eq(fields.userId, userId),
						// eq(fields.role, "admin"),
					);
				},
			});

			const isAdmin = member?.role === "admin";

			/* 
				Limitamos os dados retornados para evitar que informações sensíveis sejam expostas
				Usuários podem ser membros de um projeto, ou não. Além de membro, um usuário pode ser um administrador do projeto.

				Portanto,
				1. usuários que não são membros do projeto não podem ter acesso ao user
				2. todos os membros podem ter acesso ao (name) e a (image) do user
				3. somente membros com role === "admin" pode ter acesso a todos os dados do user
			*/

			// Precisamos obter o evento e retornar os dados com base no cargo do usuário

			const selectedEvent = await db.query.event.findFirst({
				where(fields) {
					return eq(fields.id, eventId);
				},
				with: {
					ace: true,
					membersOnEvent: {
						with: {
							member: {
								with: {
									user: isAdmin
										? true
										: member && {
												columns: {
													name: true,
													image: true,
												},
											},
								},
							},
						},
					},
				},
			});

			if (!selectedEvent) {
				throw new TRPCError({
					message: "Event not found.",
					code: "BAD_REQUEST",
				});
			} else if (!member && selectedEvent.type === "internal") {
				throw new TRPCError({
					message: "User is not a member of the project.",
					code: "FORBIDDEN",
				});
			}

			const { membersOnEvent, ...rest } = selectedEvent;

			const allMembers = membersOnEvent.map((memberOnEvent) => {
				const { member } = memberOnEvent;

				return {
					...{
						...member,
						user: isAdmin
							? member.user
							: {
									name: member.user.name,
									image: member.user.image,
								},
					},
				};
			});

			const formattedEvent = {
				...rest,
				members: allMembers,
			};

			return {
				event: formattedEvent,
			};
		}),

	getEvents: publicProcedure
		.input(
			getEventsParams.extend({
				projectId: z.string().uuid(),
				memberId: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			const {
				projectId,
				page: pageIndex,
				pageSize,
				search,
				sortBy,
				memberId,
				aces: rawAcesFilter,
				periods: periodsFilter,
				moderators: moderatorsFilter,
			} = input;

			const aces = rawAcesFilter
				? rawAcesFilter.map((aceId) => Number(aceId))
				: undefined;

			// console.log("Aces:", aces);
			// console.log("Periods filter:", periodsFilter);

			const periods =
				periodsFilter && periodsFilter.length > 0
					? await db.query.period.findMany({
							where(fields) {
								return inArray(fields.slug, periodsFilter);
							},
						})
					: undefined;

			const { dateFrom, dateTo } = getPeriodsInterval(periods);

			const [events, [{ amount }]] = await Promise.all([
				db
					.select({
						...getTableColumns(event),
						member: {
							id: member.id,
							role: member.role,
							username: member.username,
						},
						memberOnEvent: {
							memberId: memberOnEvent.memberId,
							eventId: memberOnEvent.eventId,
						},
						user: {
							name: user.name,
							image: user.image,
						},
						ace: {
							id: ace.id,
							name: ace.name,
							description: ace.description,
							hours: ace.hours,
							projectId: ace.projectId,
						},
					})
					.from(event)
					.innerJoin(
						memberOnEvent,
						eq(event.id, memberOnEvent.eventId),
					)
					.innerJoin(member, eq(memberOnEvent.memberId, member.id))
					.innerJoin(user, eq(member.userId, user.id))
					.innerJoin(ace, eq(event.aceId, ace.id))
					.where(
						and(
							eq(event.projectId, projectId),
							dateFrom && dateTo
								? and(
										gte(event.dateFrom, dateFrom),
										lte(event.dateTo, dateTo),
									)
								: undefined,
							aces ? inArray(event.aceId, aces) : undefined,
							search
								? or(
										ilike(event.name, `%${search}%`),
										ilike(event.description, `%${search}%`),
									)
								: undefined,
							memberId ? eq(member.id, memberId) : undefined,
							moderatorsFilter
								? inArray(member.id, moderatorsFilter)
								: undefined,
						),
					)
					.orderBy(
						sortBy === "recent"
							? asc(event.dateFrom)
							: desc(event.dateFrom),
					),
				db
					.select({
						amount: countDistinct(event.id),
					})
					.from(event)
					.innerJoin(
						memberOnEvent,
						eq(event.id, memberOnEvent.eventId),
					)
					.innerJoin(member, eq(memberOnEvent.memberId, member.id))
					.where(
						and(
							eq(event.projectId, projectId),
							dateFrom && dateTo
								? and(
										gte(event.dateFrom, dateFrom),
										lte(event.dateTo, dateTo),
									)
								: undefined,
							aces ? inArray(event.aceId, aces) : undefined,
							search
								? or(
										ilike(event.name, `%${search}%`),
										ilike(event.description, `%${search}%`),
									)
								: undefined,
							memberId ? eq(member.id, memberId) : undefined,
							moderatorsFilter
								? inArray(member.id, moderatorsFilter)
								: undefined,
						),
					),
			]);

			const aggregatedEvents: typeof events &
				{
					members: Array<{
						id: string;
						role: string;
						username: string;
						user: {
							name: string;
							image: string;
						};
					}>;
				}[] = [];

			const aggregateEvents = events.reduce(
				(acc: typeof aggregatedEvents, event) => {
					const existingEvent = acc.find(
						({ id }) => id === event.id,
					) as (typeof aggregatedEvents)[number];

					if (!existingEvent) {
						acc.push({
							...event,
							members: event.member
								? [
										{
											id: event.member.id,
											role: event.member.role,
											username: event.member.username,
											user: {
												name: event.user.name!,
												image: event.user.image!,
											},
										},
									]
								: [],
						});
					} else {
						existingEvent.members.push({
							id: event.member.id,
							role: event.member.role,
							username: event.member.username,
							user: {
								name: event.user.name!,
								image: event.user.image!,
							},
						});
					}

					return acc;
				},
				aggregatedEvents,
			);

			// Remove unnecessary fields (member, memberOnEvent, user)
			const formattedEvents = aggregateEvents
				.map((event) => {
					const { member, user, memberOnEvent, ...rest } = event;

					const typedEvent = rest as (typeof aggregateEvents)[number];
					const members = typedEvent.members.map((member) => {
						const { user, ...rest } = member;

						return {
							...rest,
							user: {
								...user,
							},
						};
					});

					return {
						...rest,
						members,
					};
				})
				.slice(
					pageIndex ? (pageIndex - 1) * pageSize : 0,
					pageIndex ? pageIndex * pageSize : pageSize,
				);

			// console.log("Aggregated events:", formattedEvents);
			const pageCount = Math.ceil(amount / pageSize);

			console.log("Limit: ", pageSize);
			console.log("Offset: ", pageIndex ? (pageIndex - 1) * pageSize : 0);
			console.log("All events amount: ", aggregateEvents.length);
			console.log("Events amount:", formattedEvents.length);

			return { events: formattedEvents, pageCount };
		}),

	createEvent: protectedProcedure
		.input(
			mutateEventParams.extend({
				projectId: z.string().uuid(),
			}),
		)
		.mutation(async ({ input }) => {
			const {
				name,
				description,
				dateFrom,
				dateTo,
				type,
				aceId,
				membersIds,
				projectId,
			} = input;

			const insertedEventId = await db.transaction(async (tx) => {
				const [{ insertedId }] = await tx
					.insert(event)
					.values({
						name,
						description,
						dateFrom,
						dateTo,
						type,
						aceId,
						projectId,
					})
					.returning({
						insertedId: event.id,
					});

				// Inserimos os moderadores do evento
				if (membersIds && membersIds.length > 0) {
					await tx.insert(memberOnEvent).values(
						membersIds.map((memberId) => ({
							eventId: insertedId,
							memberId,
						})),
					);
				}

				return insertedId;
			});

			return { eventId: insertedEventId };
		}),

	updateEvent: protectedProcedure
		.input(
			mutateEventParams.partial().extend({
				eventId: z.string().uuid(),
			}),
		)
		.mutation(async ({ input }) => {
			const {
				eventId,
				name,
				description,
				dateFrom,
				dateTo,
				type,
				aceId,
				membersIds, // Inclui TODOS os membros do evento
			} = input;

			const eventToUpdate = await db.query.event.findFirst({
				where(fields, { eq }) {
					return eq(fields.id, eventId);
				},
				with: {
					ace: true,
				},
			});

			if (!eventToUpdate) {
				throw new TRPCError({
					message: "Event not found.",
					code: "BAD_REQUEST",
				});
			}

			const currentEventMembers = membersIds
				? await db.query.memberOnEvent.findMany({
						where(fields, { eq }) {
							return eq(fields.eventId, eventId);
						},
					})
				: undefined;

			const { idsToAdd, idsToRemove } =
				currentEventMembers && membersIds
					? getMembersIdsToMutate({
							membersIds: membersIds!,
							currentMembersIds: currentEventMembers.map(
								(memberOnEvent) => memberOnEvent.memberId,
							),
							mode: "full",
						})
					: { idsToAdd: [], idsToRemove: [] };

			// Para ter o evento atualizado retornado, utilize: const updatedEvent = await db.transaction(async (tx) => { ... });
			await db.transaction(async (tx) => {
				const [updatedEvent] = await tx
					.update(event)
					.set({
						name,
						description,
						dateFrom,
						dateTo,
						type,
						aceId: !isNaN(Number(aceId))
							? Number(aceId)
							: undefined,
					})
					.where(eq(event.id, eventId))
					.returning();

				if (idsToRemove.length > 0) {
					await tx
						.delete(memberOnEvent)
						.where(
							and(
								eq(memberOnEvent.eventId, eventId),
								inArray(memberOnEvent.memberId, idsToRemove),
							),
						);
				}

				if (idsToAdd.length > 0) {
					await tx.insert(memberOnEvent).values(
						idsToAdd.map((memberId) => ({
							eventId,
							memberId,
						})),
					);
				}

				return updatedEvent.id;
			});

			return { success: true };
		}),

	updateEventMembers: protectedProcedure
		.input(
			z.object({
				eventId: z.string().uuid(),
				membersIdsToMutate: z
					.union([z.array(z.string()), z.string()])
					.transform(transformSingleToArray),
			}),
		)
		.mutation(async ({ input }) => {
			const { eventId, membersIdsToMutate } = input;

			if (!membersIdsToMutate) {
				throw new TRPCError({
					message: "Members not found.",
					code: "BAD_REQUEST",
				});
			}

			const currentEventMembers = await db.query.memberOnEvent.findMany({
				where(fields, { eq }) {
					return eq(fields.eventId, eventId);
				},
			});

			console.log("membersIdsToMutate:", membersIdsToMutate);
			console.log("currentEventMembers:", currentEventMembers);

			const { idsToAdd, idsToRemove } = getMembersIdsToMutate({
				membersIds: membersIdsToMutate,
				currentMembersIds: currentEventMembers.map(
					(memberOnEvent) => memberOnEvent.memberId,
				),
				mode: "partial",
			});

			console.log("Ids to add:", idsToAdd);

			await db.transaction(async (tx) => {
				if (idsToRemove.length > 0) {
					await tx
						.delete(memberOnEvent)
						.where(
							and(
								eq(memberOnEvent.eventId, eventId),
								inArray(memberOnEvent.memberId, idsToRemove),
							),
						);
				}

				if (idsToAdd.length > 0) {
					await tx.insert(memberOnEvent).values(
						idsToAdd.map((memberId) => ({
							eventId,
							memberId,
						})),
					);
				}
			});

			return { success: true };
		}),

	deleteEvent: protectedProcedure
		.input(z.object({ eventId: z.string().uuid() }))
		.mutation(async ({ input }) => {
			const { eventId } = input;

			try {
				await db.delete(event).where(eq(event.id, eventId));
			} catch (error) {
				console.error("Error deleting event:", error);
				throw new TRPCError({
					message: "Event not found.",
					code: "BAD_REQUEST",
				});
			}
		}),
});
