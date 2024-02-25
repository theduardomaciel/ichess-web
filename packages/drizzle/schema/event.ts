import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { project, user } from ".";

export const event = pgTable("events", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	dateFrom: timestamp("date_from").notNull(),
	dateTo: timestamp("date_to").notNull(),
	ace: text("ace").$type<"1" | "2" | "3" | "4" | "5" | "6">().notNull(),
	type: text("type")
		.$type<"internal" | "external">()
		.default("internal")
		.notNull(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => project.id, {
			onDelete: "restrict",
			onUpdate: "cascade",
		}),
	authorId: uuid("author_id").references(() => user.id, {
		onDelete: "set null",
		onUpdate: "cascade",
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventRelations = relations(event, ({ one }) => ({
	project: one(project, {
		fields: [event.projectId],
		references: [project.id],
	}),
	author: one(user, {
		fields: [event.authorId],
		references: [user.id],
	}),
}));
