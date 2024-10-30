import { relations } from "drizzle-orm";
import { integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { user } from ".";

export type ProviderType =
	| "oidc"
	| "oauth"
	| "email"
	| "credentials"

export type AdapterAccountType = Extract<
	ProviderType,
	"oauth" | "oidc" | "email" | "webauthn"
>

interface AdapterAccount {
	userId: string
	type: AdapterAccountType
}

export const account = pgTable(
	"accounts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		//
		type: text("type").$type<AdapterAccount["type"]>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("provider_account_id").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(table) => {
		return {
			providerProviderAccountIdUnique: uniqueIndex().on(
				table.provider,
				table.providerAccountId,
			),
		};
	},
);

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));
