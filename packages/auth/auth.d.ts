import type { Course, Period, Role } from "@ichess/drizzle/schema";
import NextAuth, { type DefaultSession, type User as DefaultUser } from "next-auth";
import type { AdapterUser as AdapterUserBase } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

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

export interface User extends DefaultUser, CustomUser { }

export interface Session extends DefaultSession {
	user: User;
	member?: Member;
	projectId: string;
}

// Extensões para AdapterUser
declare module "next-auth/adapters" {
	interface AdapterUser extends AdapterUserBase, CustomUser { }
}

// Extensões para JWT
declare module "next-auth/jwt" {
	interface JWT {
		member?: Member;
	}
}

// Aqui você pode declarar novamente as interfaces, se necessário
declare module "next-auth" {
	export interface User extends DefaultUser, CustomUser { }
	export interface Session extends DefaultSession {
		user: User;
		member?: Member;
		projectId: string;
	}
}
