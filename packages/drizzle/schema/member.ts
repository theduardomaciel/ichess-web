import { relations } from "drizzle-orm";
import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

import { memberOnEvent, project, user } from ".";

export const memberRoles = ["member", "admin"] as const;
export const roleEnum = pgEnum("role", memberRoles);

export const member = pgTable(
	"members",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		projectId: uuid("project_id")
			.notNull()
			.references(() => project.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		username: text("username").notNull(),
		role: roleEnum("role").notNull().default("member"),
		joinedAt: timestamp("joined_at").notNull().defaultNow(),
	},
	(table) => {
		return {
			userIdRoleUnique: uniqueIndex().on(table.userId, table.role),
		};
	},
);

export const memberRelations = relations(member, ({ one, many }) => ({
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
	project: one(project, {
		fields: [member.projectId],
		references: [project.id],
	}),
	membersOnEvent: many(memberOnEvent),
}));
