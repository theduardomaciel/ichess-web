import { integer, pgTable, smallserial, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { event, project } from ".";

export const ace = pgTable("aces", {
	id: smallserial("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	hours: integer("hours").notNull(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => project.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
});

export const aceRelations = relations(ace, ({ one, many }) => ({
	project: one(project, {
		fields: [ace.projectId],
		references: [project.id],
	}),
	events: many(event),
}));
