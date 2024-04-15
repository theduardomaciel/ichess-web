import { env } from "@ichess/env";
import { db } from "@ichess/drizzle";
import { GoogleProfile } from "next-auth/providers/google";
import { googleProvider } from "./google-provider";
import { drizzleAuthAdapter } from "./drizzle-auth-adapter";

// Types
import type { NextAuthConfig, Session } from "next-auth";

export const authConfig = {
	adapter: drizzleAuthAdapter,
	providers: [googleProvider],
	pages: {
		signIn: "/auth/sign-in",
		error: "/auth/error",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async signIn({ account, profile }) {
			if (account?.provider === "google") {
				const googleProfile = profile as GoogleProfile;
				const [, emailDomain] = googleProfile.email.split("@");

				const icDomain = "ic.ufal.br";

				if (!emailDomain || emailDomain !== icDomain) {
					return false;
				}

				return googleProfile.email_verified;
			} else if (account?.provider === "credentials") {
				return true;
			}

			return false;
		},
		async jwt({ token, user, session, trigger }) {
			if (user && user.id) {
				const members = await db.query.member.findMany({
					where(fields, { eq }) {
						return eq(fields.userId, user.id!);
					},
				});

				const projectsIds = members
					.filter((member) => member.role === "member")
					.map((member) => member.projectId);

				const projectsWithAdminIds = members
					.filter((member) => member.role === "admin")
					.map((member) => member.projectId);

				token.projectsIds = projectsIds;
				token.projectsWithAdminIds = projectsWithAdminIds;
			}

			function isSessionAvailable(session: unknown): session is Session {
				return !!session;
			}

			if (trigger === "update" && isSessionAvailable(session)) {
				console.log(session);
				token.name = session.user.name;
			}

			return token;
		},
		session({ session, ...params }) {
			if ("token" in params && session.user) {
				session.projectsIds = params.token.projectsIds;
				session.projectsWithAdminIds =
					params.token.projectsWithAdminIds;
				session.user.id = params.token.sub!;
			}

			return session;
		},
		authorized({ auth, request: { nextUrl } }) {
			// console.log("Auth: " + JSON.stringify(auth?.user));
			const isLoggedIn = !!auth?.user;
			const isMember = auth?.projectsIds?.includes(env.PROJECT_ID);
			const isAdmin = auth?.projectsWithAdminIds?.includes(
				env.PROJECT_ID,
			);

			console.log("Is member: " + isMember);
			console.log("Is admin: " + isAdmin);

			const privatePages = ["/dashboard", "/events/"];
			// A página de eventos é privada somente para eventos específicos (/events/[id]), a página /events é pública

			const isOnPrivatePage = privatePages.some((page) =>
				nextUrl.pathname.startsWith(page),
			);
			const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

			const isOnPublicAPIRoutes =
				nextUrl.pathname.startsWith("/api/auth");
			const isOnAPIRoutes = nextUrl.pathname.startsWith("/api");
			const isAuthenticating = nextUrl.pathname === "/auth/sign-in";

			if (isOnPublicAPIRoutes) {
				return true;
			}

			if (isOnAPIRoutes && !isLoggedIn) {
				return Response.json(
					{ message: "Unauthorized." },
					{ status: 401 },
				);
			}

			console.log("Is logged in: " + isLoggedIn);

			if (isOnPrivatePage) {
				// Check if member is trying to access dashboard
				if (isOnDashboard && isLoggedIn && !isAdmin) {
					return Response.redirect(
						new URL(
							`/auth/error?error=PermissionLevelError`,
							nextUrl,
						),
					);
				} else if (isMember) {
					// Nem todos os usuários logados podem acessar, somente membros
					// Temos que cuidar desse comportamento caso outros projetos sejam adicionados
					return true;
				}

				// Redirect user back to sign in
				return false;
			}

			if (isAuthenticating && isLoggedIn) {
				return Response.redirect(new URL("/", nextUrl));
			}

			return true;
		},
	},
} satisfies NextAuthConfig;
