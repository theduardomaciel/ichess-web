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
		async jwt({ token, session, trigger }) {
			function isSessionAvailable(session: unknown): session is Session {
				return !!session;
			}

			if (trigger === "update" && isSessionAvailable(session)) {
				console.log(session);

				const members = await db.query.member.findMany({
					where(fields, { eq }) {
						return eq(fields.userId, session.user.id!);
					},
				});

				const projectsIds = members.map((member) => member.projectId);

				token.name = session.user.name;
				token.projectsIds = projectsIds;
			}

			return token;
		},
		session({ session, ...params }) {
			if ("token" in params && session.user) {
				session.user.id = params.token.sub!;
			}

			return session;
		},
		authorized({ auth, request: { nextUrl } }) {
			console.log("Auth: " + auth?.user);
			const isLoggedIn = !!auth?.user;

			const publicPages = ["/", "/join", "/members", "/events"];

			const isOnPublicPages =
				nextUrl.pathname.startsWith("/auth") ||
				publicPages.includes(nextUrl.pathname);
			const isOnWebhooks = nextUrl.pathname.startsWith("/api/webhooks");
			const isOnPublicAPIRoutes =
				nextUrl.pathname.startsWith("/api/auth");
			const isOnAPIRoutes = nextUrl.pathname.startsWith("/api");
			const isOnPrivatePages = !isOnPublicPages;

			if (isOnWebhooks || isOnPublicAPIRoutes) {
				return true;
			}

			/* if (isOnPublicPages && isLoggedIn) {
				return Response.redirect(new URL("/", nextUrl));
			} */

			if (isOnAPIRoutes && !isLoggedIn) {
				return Response.json(
					{ message: "Unauthorized." },
					{ status: 401 },
				);
			}

			if (isOnPrivatePages && !isLoggedIn) {
				// Redirect user back to sign in
				return false;
			}

			return true;
		},
	},
} satisfies NextAuthConfig;
