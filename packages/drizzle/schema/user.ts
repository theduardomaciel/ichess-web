import { relations } from "drizzle-orm";
import {
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

import { account, session, member } from ".";

export const user = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name"),
		email: text("email").notNull(),
		emailVerified: timestamp("email_verified"),
		course: text("course").$type<"cc" | "ec">().notNull(),
		registrationId: text("registration_id").notNull(),
		period: text("period")
			.$type<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8">()
			.notNull(),
	},
	(table) => {
		return {
			emailUnique: uniqueIndex().on(table.email),
		};
	},
);

export const userRelations = relations(user, ({ many }) => ({
	accounts: many(account),
	sessions: many(session),
	members: many(member),
}));
