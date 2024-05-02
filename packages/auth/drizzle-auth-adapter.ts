import { env } from "@ichess/env";

import { db } from "@ichess/drizzle";
import { account, member, session, user } from "@ichess/drizzle/schema";
import { and, eq, getTableColumns } from "@ichess/drizzle/orm";

// Types
import type { Adapter } from "@auth/core/adapters";

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
		const [authUser] = await db
			.select({
				user: getTableColumns(user),
				id: member.id,
				username: member.username,
				role: member.role,
			})
			.from(user)
			.leftJoin(member, eq(member.userId, user.id))
			.where(
				and(
					eq(user.id, id),
					eq(member.projectId, env.PROJECT_ID),
					eq(member.userId, user.id),
				),
			);

		if (authUser) {
			const { id, username, role, ...rest } = authUser;

			return {
				...rest.user,
				member: id
					? {
							id,
							username,
							role,
						}
					: undefined,
			};
		}

		return null;
	},

	async getUserByEmail(email) {
		const authUser = await db.transaction(async (trx) => {
			const [userByEmail] = await trx
				.select({
					user: getTableColumns(user),
					id: member.id,
					username: member.username,
					role: member.role,
				})
				.from(user)
				.leftJoin(member, eq(member.userId, user.id))
				.where(
					and(
						eq(user.email, email),
						eq(member.projectId, env.PROJECT_ID),
						eq(member.userId, user.id),
					),
				);

			return userByEmail;
		});

		if (authUser) {
			const { id, username, role, ...rest } = authUser;

			return {
				...rest.user,
				member: id
					? {
							id,
							username,
							role,
						}
					: undefined,
			};
		}

		return null;
	},

	async getUserByAccount({ providerAccountId, provider }) {
		const [authUser] = await db
			.select({
				user: getTableColumns(user),
				id: member.id,
				username: member.username,
				role: member.role,
			})
			.from(user)
			.leftJoin(member, eq(member.userId, user.id))
			.innerJoin(account, eq(account.userId, user.id))
			.where(
				and(
					eq(account.provider, provider),
					eq(account.providerAccountId, providerAccountId),
					eq(member.projectId, env.PROJECT_ID),
					eq(member.userId, user.id),
				),
			);

		if (authUser) {
			const { id, username, role, ...rest } = authUser;

			return {
				...rest.user,
				member: id
					? {
							id,
							username,
							role,
						}
					: undefined,
			};
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
