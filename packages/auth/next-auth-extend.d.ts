import type { AdapterUser as AdapterUserBase } from "@auth/core/adapters";
import type { DefaultSession, User as DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

interface CustomUser {
	/* projectId: string; */
	course: "cc" | "ec" | null;
	registrationId: string | null;
	period: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | null;
}

declare module "@auth/core/adapters" {
	export interface AdapterUser extends AdapterUserBase, CustomUser {}
}

declare module "next-auth" {
	interface User extends DefaultUser, CustomUser {}

	export interface Session extends DefaultSession {
		user: User;
		projectsIds: string[];
		projectsWithAdminIds: string[];
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		/* projectId: string; */
		projectsIds: string[];
		projectsWithAdminIds: string[];
	}
}
