import type { Course, Period, Role } from "@ichess/drizzle/schema";

interface CustomUser {
	course: Course | null;
	period: Period | null;
	registrationId: string | null;
}

interface Member {
	id: string;
	role: Role;
	username: string;
}

import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User extends DefaultSession['User'], CustomUser { }

	export interface Session extends DefaultSession {
		user: User;
		member?: Member;
		projectId: string;
	}
}

import type { AdapterUser as AdapterUserBase } from "next-auth/adapters";

declare module "next-auth/adapters" {
	interface AdapterUser extends AdapterUserBase, CustomUser { }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
	interface JWT {
		member?: Member;
	}
}
