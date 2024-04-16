import { env } from "@ichess/env";
import { db } from "@ichess/drizzle";

import { drizzleAuthAdapter } from "./drizzle-auth-adapter";
import { googleProvider } from "./google-provider";

// Types
import type { NextAuthConfig, Session } from "next-auth";
import type { GoogleProfile } from "next-auth/providers/google";

const icDomain = "ic.ufal.br";

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

				if (!emailDomain || emailDomain !== icDomain) {
					return false;
				}

				return googleProfile.email_verified;
			}

			return false;
		},
		async jwt({ token, user, session, trigger }) {
			if (user) {
				token.role = user.members[0].role;
			}

			function isSessionAvailable(session: unknown): session is Session {
				return !!session;
			}

			if (trigger === "update" && isSessionAvailable(session)) {
				token.name = session.user.name;
			}

			return token;
		},
		session({ session, ...params }) {
			if ("token" in params && session.user) {
				session.role = params.token.role;
				session.user.id = params.token.sub!;
			}

			return session;
		},
		authorized({ auth, request: { nextUrl, cookies } }) {
			/* const isLoggedIn = !!auth?.user;
			const isMember = auth?.role === "member";
			const isAdmin = auth?.role === "admin";

			const privatePages = ["/auth"];
			const privatePaths = ["/events/", "/dashboard"];
			// A página de eventos é privada somente para eventos específicos (/events/[id]); a página /events é pública

			const isOnPrivatePage =
				privatePaths.some((page) =>
					nextUrl.pathname.startsWith(page),
				) || privatePages.some((page) => nextUrl.pathname === page);

			const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
			const isOnPublicAPIRoutes =
				nextUrl.pathname.startsWith("/api/auth");
			const isOnAPIRoutes = nextUrl.pathname.startsWith("/api");
			const isOnUnauthenticatedRoutes =
				nextUrl.pathname === "/auth/sign-in";

			if (isOnPublicAPIRoutes) {
				return true;
			}

			if (isOnAPIRoutes && !isLoggedIn) {
				return Response.json(
					{ message: "Unauthorized." },
					{ status: 401 },
				);
			} */

			/* if (isOnUnauthenticatedRoutes && isLoggedIn) {
				return Response.redirect(new URL("/auth", nextUrl));
			} */

			/* if (isOnPrivatePage) {
				console.log("Private page");

				cookies.set("internal.callback-url", nextUrl.toString());

				// Checamos se o membro tem permissão para acessar a página
				// O "isLoggedIn" é necessário pois caso não existisse, um usuário nao logado seria redirecionado para a tela de erro
				if (isOnDashboard && isLoggedIn && !isAdmin) {
					console.log("Redirecting to error page");
					return Response.redirect(
						new URL(
							`/auth/error?error=PermissionLevelError`,
							nextUrl,
						),
					);
				}

				if (isMember) {
					// Nem todos os usuários logados podem acessar, somente membros do projeto em questão
					// Cuidamos desse comportamento no caso de outros projetos serem adicionados
					return true;
				}

				// Redireciona o usuário para a página de login
				return false;
			} */

			return true;
		},
	},
} satisfies NextAuthConfig;
