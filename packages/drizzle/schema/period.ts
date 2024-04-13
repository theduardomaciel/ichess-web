import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const period = pgTable("periods", {
	slug: text("slug").primaryKey().unique(),
	from: timestamp("from").notNull(),
	to: timestamp("to").notNull(),
});
