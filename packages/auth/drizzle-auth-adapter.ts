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
		const authUser = await db.query.user.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, id);
			},
			with: {
				members: {
					where: (fields, { eq, and }) =>
						and(
							eq(fields.userId, id),
							eq(fields.projectId, env.PROJECT_ID),
						),
					columns: {
						id: true,
						role: true,
						username: true,
					},
				},
			},
		});

		// Precisamos unir os campos de membros com o usuário
		// para que a resposta seja um objeto único

		if (authUser) {
			const { members, ...rest } = authUser as typeof authUser & {
				members: typeof authUser.members;
			};

			return {
				...rest,
				member: {
					id: members[0].id,
					role: members[0].role,
					username: members[0].username,
				},
			};
		} else {
			return null;
		}
	},

	async getUserByEmail(email) {
		const authUser = await db.query.user.findFirst({
			where(fields, { eq }) {
				return eq(fields.email, email);
			},
			with: {
				members: {
					where: (fields, { eq, and }) =>
						and(
							eq(fields.userId, fields.id),
							eq(fields.projectId, env.PROJECT_ID),
						),
					columns: {
						id: true,
						role: true,
						username: true,
					},
				},
			},
		});

		if (authUser) {
			const { members, ...rest } = authUser as typeof authUser & {
				members: typeof authUser.members;
			};

			return {
				...rest,
				member: {
					id: members[0].id,
					role: members[0].role,
					username: members[0].username,
				},
			};
		} else {
			return null;
		}
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
				member: {
					id,
					username,
					role,
				},
			};
		} else {
			return null;
		}
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
		const drizzleSession = await db.query.session.findFirst({
			where(fields, { eq }) {
				return eq(fields.sessionToken, sessionToken);
			},
			with: {
				user: {
					with: {
						members: {
							where: (fields, { eq, and }) =>
								and(
									eq(fields.userId, fields.id),
									eq(fields.projectId, env.PROJECT_ID),
								),
							columns: {
								id: true,
								role: true,
								username: true,
							},
						},
					},
				},
			},
		});

		if (!drizzleSession) {
			return null;
		}

		console.log("drizzleSession", drizzleSession);

		const { user, ...session } = drizzleSession;

		if (user) {
			const { members, ...rest } = user as typeof user & {
				members: typeof user.members;
			};

			return {
				user: { ...rest, ...members[0] },
				session,
			};
		}

		return {
			user,
			session,
		};
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
