import { env } from "@ichess/env";

import { db } from "@ichess/drizzle";
import { account, member, session, user } from "@ichess/drizzle/schema";
import { and, eq, getTableColumns } from "@ichess/drizzle/orm";

// Types
import type { Adapter } from "next-auth/adapters";

export const drizzleAuthAdapter: Adapter = {
	async createUser(userToCreate) {
		const [drizzleUser] = await db
			.insert(user)
			.values({
				...userToCreate,
				id: crypto.randomUUID(),
				emailVerified: new Date(),
			})
			.returning();

		return drizzleUser;
	},

	async getUser(id) {
		const authUser = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.id, id),
		});

		if (authUser) {
			return authUser;
		}

		return null;
	},

	async getUserByEmail(email) {
		const authUser = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.email, email),
		});

		if (authUser) {
			return authUser;
		}

		return null;
	},

	async getUserByAccount({ providerAccountId, provider }) {
		try {
			const [authUser] = await db
				.select({
					user: getTableColumns(user),
				})
				.from(user)
				.innerJoin(account, eq(account.userId, user.id))
				.where(
					and(
						eq(account.provider, provider),
						eq(account.providerAccountId, providerAccountId),
					),
				);

			if (authUser) {
				return authUser.user;
			}
		} catch (error) {
			console.error("getUserByAccount", error);
			return null;
		}

		return null;
	},

	async updateUser({ id, ...userToUpdate }) {
		if (!id) {
			throw new Error("No user id.");
		}

		const [drizzleUser] = await db
			.update(user)
			.set(userToUpdate)
			.where(eq(user.id, id))
			.returning();

		return drizzleUser;
	},

	async linkAccount(accountToCreate) {
		await db.insert(account).values(accountToCreate);
	},

	async createSession(sessionToCreate) {
		const [drizzleSession] = await db
			.insert(session)
			.values(sessionToCreate)
			.returning();

		return drizzleSession;
	},

	async getSessionAndUser(sessionToken) {
		const [drizzleSession] = await db
			.select({
				session: getTableColumns(session),
				user: getTableColumns(user),
			})
			.from(session)
			.innerJoin(user, eq(user.id, session.userId))
			.where(eq(session.sessionToken, sessionToken));

		return drizzleSession;
	},

	async updateSession({ sessionToken, ...sessionToUpdate }) {
		const [drizzleSession] = await db
			.update(session)
			.set(sessionToUpdate)
			.where(eq(session.sessionToken, sessionToken))
			.returning();

		return drizzleSession;
	},

	async deleteSession(sessionToken) {
		await db.delete(session).where(eq(session.sessionToken, sessionToken));
	},
};
