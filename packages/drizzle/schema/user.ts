import { relations } from "drizzle-orm";
import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

import { account, session, member } from ".";

export const userCourses = ["cc", "ec"] as const;
export const courseEnum = pgEnum("course", userCourses);

export const userPeriods = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
export const periodEnum = pgEnum("period", userPeriods);

export const user = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name"),
		email: text("email").notNull(),
		emailVerified: timestamp("emailVerified", { mode: "date" }),
		image: text("image"),
		course: courseEnum("course"),
		registrationId: text("registration_id").unique(),
		period: periodEnum("period"),
	},
	(table) => {
		return {
			emailUnique: uniqueIndex().on(table.email),
			registrationIdUnique: uniqueIndex().on(table.registrationId),
		};
	},
);

export const userRelations = relations(user, ({ many }) => ({
	accounts: many(account),
	sessions: many(session),
	members: many(member),
}));
