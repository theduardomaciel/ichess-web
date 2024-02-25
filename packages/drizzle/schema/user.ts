import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { account, project, session } from ".";

export const user = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name"),
	course: text("course").$type<"cc" | "ec">(),
	registrationId: text("registration_id"),
	period: text("period")
		.$type<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8">()
		.notNull(),
	username: text("username").notNull(),
	role: text("role").$type<"student" | "moderator" | "admin">().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
	projects: many(project),
	sessions: many(session),
	accounts: many(account),
}));
