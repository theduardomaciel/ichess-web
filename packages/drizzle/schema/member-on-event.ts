import { relations } from "drizzle-orm";
import { pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { member, event } from ".";

export const memberOnEvent = pgTable(
	"member_events",
	{
		memberId: uuid("member_id")
			.notNull()
			.references(() => member.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		eventId: uuid("event_id")
			.notNull()
			.references(() => event.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		joinedAt: timestamp("joined_at").notNull().defaultNow(),
	},
	(table) => {
		return {
			memberIdEventIdUnique: uniqueIndex().on(
				table.memberId,
				table.eventId,
			),
		};
	},
);

export const memberOnEventRelations = relations(memberOnEvent, ({ one }) => ({
	member: one(member, {
		fields: [memberOnEvent.memberId],
		references: [member.id],
	}),
	event: one(event, {
		fields: [memberOnEvent.eventId],
		references: [event.id],
	}),
}));
