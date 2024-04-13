import { relations } from "drizzle-orm";
import {
	pgTable,
	smallserial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

import { ace, memberOnEvent, project, user } from ".";

export const EventTypes = ["internal", "external"] as const;

export const event = pgTable("events", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	dateFrom: timestamp("date_from").notNull(),
	dateTo: timestamp("date_to").notNull(),
	type: text("type")
		.$type<(typeof EventTypes)[number]>()
		.default("internal")
		.notNull(),
	aceId: smallserial("ace_id").references(() => ace.id, {
		onDelete: "set null",
		onUpdate: "cascade",
	}),
	authorId: uuid("author_id").references(() => user.id, {
		onDelete: "set null",
		onUpdate: "cascade",
	}),
	projectId: uuid("project_id")
		.notNull()
		.references(() => project.id, {
			onDelete: "restrict",
			onUpdate: "cascade",
		}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventRelations = relations(event, ({ one, many }) => ({
	project: one(project, {
		fields: [event.projectId],
		references: [project.id],
	}),
	author: one(user, {
		fields: [event.authorId],
		references: [user.id],
	}),
	ace: one(ace, {
		fields: [event.aceId],
		references: [ace.id],
	}),
	membersOnEvent: many(memberOnEvent),
}));
