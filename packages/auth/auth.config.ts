import { env } from "@ichess/env";

import { drizzleAuthAdapter } from "./drizzle-auth-adapter";
import { googleProvider } from "./google-provider";

// Types
import type { NextAuthConfig, Session } from "next-auth";
import type { GoogleProfile } from "next-auth/providers/google";

const icDomain = "@ic.ufal.br";

export const authConfig = {
	adapter: drizzleAuthAdapter,
	providers: [googleProvider],
	pages: {
		signIn: "/auth/sign-in",
		error: "/auth/error",
	},
	session: {
		strategy: "jwt",
		updateAge: 60 * 60 * 24, // 24 hours
	},
	callbacks: {
		async signIn({ account, profile }) {
			console.log("Sign in", { account, profile });

			if (account?.provider === "google") {
				const googleProfile = profile as GoogleProfile;

				return googleProfile.email.endsWith(icDomain);
			}

			return false;
		},
		async jwt({ token, user, session, trigger }) {
			console.log("O usuário é membro do grupo de extensão? ", !!user.member);
			if (user.member) {
				token.member = user.member;
			}

			function isSessionAvailable(session: unknown): session is Session {
				return !!session;
			}

			if (trigger === "update" && isSessionAvailable(session)) {
				token.name = session.user.name;
				token.email = session.user.email;
				token.member = session.member;
			}

			return token;
		},
		session({ session, ...params }) {
			if ("token" in params && session.user) {
				session.user.id = params.token.sub as string;
				session.member = params.token.member;
				session.projectId = env.PROJECT_ID;
			}

			// console.log("Session", session);

			return session;
		},
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isMember = !!auth?.member?.role;
			const isAdmin = auth?.member?.role === "admin";

			console.log("Authorized", { isLoggedIn, isMember, isAdmin });
			// console.log("Pathname", nextUrl.pathname);

			const authenticatedPages = ["/auth"];
			const privatePaths = ["/events/", "/members/"];
			// A página de eventos é privada somente para eventos específicos (/events/[id]); a página /events é pública

			const isOnPrivatePages = privatePaths.some((page) =>
				nextUrl.pathname.startsWith(page),
			);
			// privatePages.some((page) => nextUrl.pathname === page)
			const isOnAuthenticatedPages = authenticatedPages.some(
				(page) => nextUrl.pathname === page,
			);

			const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

			const guestPages = ["/auth/sign-in", "/join"];

			const isOnGuestPages = guestPages.some(
				(page) => nextUrl.pathname === page,
			);

			const isOnPublicAPIRoutes = nextUrl.pathname.startsWith("/api/auth");
			const isOnAPIRoutes = nextUrl.pathname.startsWith("/api");

			if (isOnPublicAPIRoutes) {
				return true;
			}

			if (isOnAPIRoutes && !isLoggedIn) {
				return Response.json({ message: "Unauthorized." }, { status: 401 });
			}

			// Páginas públicas que não devem ser acessadas por membros
			if (isOnGuestPages && isMember) {
				return Response.redirect(new URL("/", nextUrl));
			}

			// Páginas exclusivas para usuários autenticados
			if (isOnAuthenticatedPages && !isLoggedIn) {
				return false;
			}

			// Páginas exclusivas para membros
			if ((isOnPrivatePages || isOnDashboard) && !isMember) {
				if (isLoggedIn) {
					// Redirect user back to sign in
					console.log("Redirecting to sign-in page");
					return Response.redirect(
						new URL("/auth/error?error=NotAuthenticated", nextUrl),
					);
				}

				return false;
			}

			// Páginas exclusivas para administradores
			if (isOnDashboard && isLoggedIn && !isAdmin) {
				console.log("Redirecting to error page");
				return Response.redirect(
					new URL("/auth/error?error=PermissionLevelError", nextUrl),
				);
			}

			return true;
		},
	},
} satisfies NextAuthConfig;
