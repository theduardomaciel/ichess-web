import type { AdapterUser as AdapterUserBase } from "@auth/core/adapters";
import type { DefaultSession, User as DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

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

declare module "@auth/core/adapters" {
	export interface AdapterUser extends AdapterUserBase, CustomUser {}
}

declare module "next-auth" {
	interface User extends DefaultUser, CustomUser {}

	export interface Session extends DefaultSession {
		user: User;
		member?: Member;
		projectId: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		member?: Member;
	}
}
