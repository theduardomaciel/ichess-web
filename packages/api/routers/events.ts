import { db } from "@ichess/drizzle";
import { event, EventTypes, memberOnEvent, ace } from "@ichess/drizzle/schema";
import { transformSingleToArray } from "../utils";
import {
	and,
	count,
	desc,
	eq,
	getTableColumns,
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
	periodsFilter: z
		.union([z.array(z.string()), z.string()])
		.optional()
		.transform(transformSingleToArray),
	acesFilter: z
		.union([z.array(z.string()), z.string()])
		.optional()
		.transform(transformSingleToArray),
	responsibleFilter: z
		.union([z.array(z.string()), z.string()])
		.optional()
		.transform(transformSingleToArray),
	pageIndex: z.coerce.number().default(0),
	pageSize: z.coerce.number().default(10),
});

const mutateEventParams = z.object({
	name: z.string().min(1),
	description: z.string().nullable(),
	dateFrom: z.string().transform((value) => new Date(value)),
	dateTo: z.string().transform((value) => new Date(value)),
	type: z.enum(EventTypes),
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
			}

			return {
				event: selectedEvent,
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
				pageIndex,
				pageSize,
				search,
				sortBy,
				acesFilter,
				periodsFilter,
				responsibleFilter,
			} = input;

			const eventColumns = getTableColumns(event);

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
				db
					.select({
						...eventColumns,
						membersOnEvent: {
							memberId: memberOnEvent.memberId,
						},
						ace: {
							id: ace.id,
							description: ace.description,
							hours: ace.hours,
						},
					})
					.from(event)
					.leftJoin(
						memberOnEvent,
						eq(memberOnEvent.eventId, event.id),
					)
					.leftJoin(ace, eq(event.aceId, ace.id))
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
							// É necessário fazer uma junção pois os responsáveis são membros com o "role" === "admin"
							responsibleFilter && responsibleFilter.length > 0
								? inArray(
										memberOnEvent.memberId,
										responsibleFilter,
									)
								: undefined,
							or(
								search
									? ilike(event.name, `%${search}%`)
									: undefined,
								search
									? ilike(event.description, `%${search}%`)
									: undefined,
							),
						),
					)
					.orderBy(
						sortBy === "recent"
							? desc(event.dateFrom)
							: event.dateFrom,
					)
					.offset(pageIndex * pageSize)
					.limit(pageSize),
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
							// É necessário fazer uma junção pois os responsáveis são membros com o "role" === "admin"
							responsibleFilter && responsibleFilter.length > 0
								? inArray(
										memberOnEvent.memberId,
										responsibleFilter,
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

			// console.log(events);
			// console.log("Amount: ", amount);

			const pageCount = Math.ceil(amount / pageSize);

			/* const eventsWithAce = await Promise.all(
				events.map(async (event) => {
					let ace = acesFilter
						? aces?.find((ace) => ace.id === event.aceId)
						: undefined;

					if (!ace) {
						const acesIds = events
							.map((event) => event.aceId)
							.filter(
								(aceId, index, self) =>
									self.indexOf(aceId) === index,
							); // Remove duplicates

						const eventsAces = await db.query.ace.findMany({
							where(fields) {
								return inArray(fields.id, acesIds);
							},
						});

						ace = eventsAces.find((ace) => ace.id === event.aceId);
					}

					return {
						...event,
						ace,
					};
				}),
			); */

			return { events, pageCount };
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