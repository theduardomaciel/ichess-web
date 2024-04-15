import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { memberOnEvent, project, user } from ".";

const roleEnum = pgEnum("role", ["member", "admin"]);

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
