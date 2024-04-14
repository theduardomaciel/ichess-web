import { db } from "@ichess/drizzle";
import { event, EventTypes, user, memberOnEvent } from "@ichess/drizzle/schema";
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

export const eventsParams = z.object({
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

export const eventsRouter = createTRPCRouter({
	getEvent: protectedProcedure
		.input(z.object({ eventId: z.string().uuid() }))
		.query(async ({ input }) => {
			const { eventId } = input;

			const event = await db.query.event.findFirst({
				with: {
					membersOnEvent: {
						with: {
							member: true,
						},
					},
				},
				where(fields, { eq }) {
					return eq(fields.id, eventId);
				},
			});

			if (!event) {
				throw new TRPCError({
					message: "Event not found.",
					code: "BAD_REQUEST",
				});
			}

			const { membersOnEvent, ...rest } = event;

			const users = await db.query.user.findMany({
				where(fields, { inArray }) {
					return inArray(
						fields.id,
						membersOnEvent.map((item) => item.memberId),
					);
				},
			});

			const members = membersOnEvent.map((item) => {
				const user = users.find((user) => user.id === item.memberId);

				return {
					...item,
					user,
				};
			});

			return {
				event: {
					...rest,
					members,
				},
			};
		}),

	getEvents: protectedProcedure
		.input(
			eventsParams.extend({
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

			console.log(acesFilter);

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
						author: {
							name: user.name,
							image: user.image,
						},
						memberOnEvent: {
							memberId: memberOnEvent.memberId,
						},
					})
					.from(event)
					.leftJoin(
						memberOnEvent,
						eq(memberOnEvent.eventId, event.id),
					)
					.leftJoin(user, eq(event.authorId, user.id))
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

			console.log(events);
			console.log("Amount: ", amount);

			const pageCount = Math.ceil(amount / pageSize);

			return { events, pageCount };
		}),

	updateEvent: protectedProcedure
		.input(
			z.object({
				eventId: z.string().uuid(),
				name: z.string().min(1),
				description: z.string().nullable(),
				dateFrom: z.string().transform((value) => new Date(value)),
				dateTo: z.string().transform((value) => new Date(value)),
				type: z.enum(EventTypes),
				aceId: z.string().uuid(),
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

			const currentEventMembers = await db.query.memberOnEvent.findMany({
				where(fields, { eq }) {
					return eq(fields.eventId, eventId);
				},
			});

			/* const currentEventMembersIds = currentEventMembers.map(
				(item) => item.memberId,
			);

			const membersIds = input.membersIds;

			const membersIdsToRemove = currentEventMembersIds.filter(
				(memberId) => !membersIds.includes(memberId),
			);

			const membersIdsToAdd = membersIds.filter((memberId) => {
				return !currentEventMembersIds.includes(memberId);
			}); */

			const membersIdsToRemove = currentEventMembers
				.filter((item) => !input.membersIds.includes(item.memberId))
				.map((item) => item.memberId);

			const membersIdsToAdd = input.membersIds.filter(
				(memberId) =>
					!currentEventMembers.find(
						(item) => item.memberId === memberId,
					),
			);

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
