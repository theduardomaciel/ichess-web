import { db } from "@ichess/drizzle";
import { event, eventTypes, memberOnEvent } from "@ichess/drizzle/schema";
import { transformSingleToArray } from "../utils";
import {
	and,
	count,
	desc,
	eq,
	inArray,
	gte,
	lte,
	or,
	ilike,
} from "@ichess/drizzle/orm";
import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const getEventsParams = z.object({
	search: z.string().optional(),
	sortBy: z.enum(["recent", "oldest"]).optional(),
	page: z.coerce.number().default(0),
	pageSize: z.coerce.number().default(10),
	periods: z
		.union([z.array(z.string()), z.string()])
		.optional()
		.transform(transformSingleToArray),
	aces: z
		.union([z.array(z.string()), z.string()])
		.optional()
		.transform(transformSingleToArray),
	moderators: z
		.union([z.array(z.string()), z.string()])
		.optional()
		.transform(transformSingleToArray),
});

const mutateEventParams = z.object({
	name: z.string().min(1),
	description: z.string().nullable(),
	dateFrom: z.string().transform((value) => new Date(value)),
	dateTo: z.string().transform((value) => new Date(value)),
	type: z.enum(eventTypes),
	aceId: z.string().uuid(),
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

			/* if (!member) {
				throw new TRPCError({
					message: "User is not a member of the project.",
					code: "BAD_REQUEST",
				});
			} */

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

			const formattedEvent = {
				...selectedEvent,
				membersOnEvent: selectedEvent.membersOnEvent.map(
					(memberOnEvent) => {
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
					},
				),
			};

			return {
				event: formattedEvent,
			};
		}),

	getEvents: protectedProcedure
		.input(
			getEventsParams.extend({
				projectId: z.string().uuid(),
			}),
		)
		.query(async ({ input }) => {
			const {
				projectId,
				page: pageIndex,
				pageSize,
				search,
				sortBy,
				aces: acesFilter,
				periods: periodsFilter,
				moderators: moderatorsFilter,
			} = input;

			const acesFilterConverted = acesFilter
				? acesFilter.map((aceId) => Number(aceId))
				: undefined;

			const aces =
				acesFilterConverted && acesFilterConverted.length > 0
					? await db.query.ace.findMany({
							where(fields) {
								return inArray(fields.id, acesFilterConverted);
							},
							columns: {
								id: true,
							},
						})
					: undefined;

			const periods =
				periodsFilter && periodsFilter.length > 0
					? await db.query.period.findMany({
							where(fields) {
								return inArray(fields.slug, periodsFilter);
							},
						})
					: undefined;

			const dateFrom = periods
				?.map((period) => period.from)
				.reduce((acc, date) => {
					return acc < date ? acc : date;
				});

			const dateTo = periods
				?.map((period) => period.to)
				.reduce((acc, date) => {
					return acc > date ? acc : date;
				});

			const [events, [{ amount }]] = await Promise.all([
				db.query.event.findMany({
					where(fields) {
						return and(
							eq(fields.projectId, projectId),
							dateFrom && dateTo
								? and(
										gte(fields.dateFrom, dateFrom),
										lte(fields.dateTo, dateTo),
									)
								: undefined,
							aces
								? inArray(
										fields.aceId,
										aces.map((ace) => ace.id),
									)
								: undefined,
							search
								? or(
										ilike(fields.name, `%${search}%`),
										ilike(
											fields.description,
											`%${search}%`,
										),
									)
								: undefined,
						);
					},
					with: {
						ace: true,
						membersOnEvent: {
							with: {
								member: {
									with: {
										user: {
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
					orderBy:
						sortBy === "recent"
							? desc(event.dateFrom)
							: event.dateFrom,
					offset: (pageIndex - 1) * pageSize,
					limit: pageSize,
				}),
				db
					.select({ amount: count() })
					.from(event)
					.where(
						and(
							eq(event.projectId, projectId),
							dateFrom && dateTo
								? and(
										gte(event.dateFrom, dateFrom),
										lte(event.dateTo, dateTo),
									)
								: undefined,
							aces
								? inArray(
										event.aceId,
										aces.map((ace) => ace.id),
									)
								: undefined,
							search
								? or(
										ilike(event.name, `%${search}%`),
										ilike(event.description, `%${search}%`),
									)
								: undefined,
						),
					),
			]);

			const filteredEvents = events.filter((event) => {
				if (moderatorsFilter && moderatorsFilter.length > 0) {
					return event.membersOnEvent.some(
						(memberOnEvent) =>
							memberOnEvent.member.role === "admin" &&
							moderatorsFilter.includes(memberOnEvent.memberId),
					);
				} else {
					return true;
				}
			});

			const formattedEvents = filteredEvents.map((event) => {
				return {
					...event,
					membersOnEvent: event.membersOnEvent.map(
						(memberOnEvent) => {
							const { member } = memberOnEvent;

							return {
								...{
									...member,
									user: {
										name: member.user.name,
										image: member.user.image,
									},
								},
							};
						},
					),
				};
			});

			const pageCount = Math.ceil(amount / pageSize);

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
				projectId,
			} = input;

			const newEvent = await db.transaction(async (tx) => {
				const [createdEvent] = await tx
					.insert(event)
					.values({
						name,
						description,
						dateFrom,
						dateTo,
						type,
						aceId: !isNaN(Number(aceId))
							? Number(aceId)
							: undefined,
						projectId,
					})
					.returning();

				return createdEvent;
			});

			return { event: newEvent };
		}),

	updateEvent: protectedProcedure
		.input(
			mutateEventParams.extend({
				eventId: z.string().uuid(),
				membersIds: z.array(z.string().uuid()).default([]),
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
				membersIds,
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

			const membersIdsToRemove = currentEventMembers
				? currentEventMembers
						.filter((item) => membersIds.includes(item.memberId))
						.map((item) => item.memberId)
				: [];

			const membersIdsToAdd = currentEventMembers
				? membersIds.filter(
						(memberId) =>
							!currentEventMembers.find(
								(item) => item.memberId === memberId,
							),
					)
				: [];

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

				if (membersIdsToRemove.length > 0) {
					await tx
						.delete(memberOnEvent)
						.where(
							and(
								eq(memberOnEvent.eventId, eventId),
								inArray(
									memberOnEvent.memberId,
									membersIdsToRemove,
								),
							),
						);
				}

				if (membersIdsToAdd.length > 0) {
					await tx.insert(memberOnEvent).values(
						membersIdsToAdd.map((memberId) => ({
							eventId,
							memberId,
						})),
					);
				}

				return updatedEvent;
			});
		}),

	deleteEvent: protectedProcedure
		.input(z.object({ eventId: z.string().uuid() }))
		.mutation(async ({ input }) => {
			const { eventId } = input;

			try {
				await db.delete(event).where(eq(event.id, eventId));
			} catch (error) {
				throw new TRPCError({
					message: "Event not found.",
					code: "BAD_REQUEST",
				});
			}
		}),
});
