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
				// console.log("User", user);
				token.role = user.member?.role || null;
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
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isMember = auth?.role === "member";
			const isAdmin = auth?.role === "admin";

			console.log("Authorized", { isLoggedIn, isMember, isAdmin });
			// console.log("Pathname", nextUrl.pathname);

			const privatePages = ["/auth"];
			const privatePaths = ["/events/", "/members/"];
			// A página de eventos é privada somente para eventos específicos (/events/[id]); a página /events é pública

			const isOnPrivatePages =
				privatePaths.some((page) =>
					nextUrl.pathname.startsWith(page),
				) || privatePages.some((page) => nextUrl.pathname === page);
			const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

			const guestPages = ["/auth/sign-in"];

			const isOnGuestPages = guestPages.some(
				(page) => nextUrl.pathname === page,
			);

			const isOnPublicAPIRoutes =
				nextUrl.pathname.startsWith("/api/auth");
			const isOnAPIRoutes = nextUrl.pathname.startsWith("/api");

			if (isOnPublicAPIRoutes) {
				return true;
			}

			if (isOnGuestPages && isLoggedIn) {
				return Response.redirect(new URL("/", nextUrl));
			}

			if (isOnAPIRoutes && !isLoggedIn) {
				return Response.json(
					{ message: "Unauthorized." },
					{ status: 401 },
				);
			}

			if ((isOnPrivatePages || isOnDashboard) && !isMember && !isAdmin) {
				// Redirect user back to sign in
				console.log("Redirecting to sign-in page");
				return false;
			}

			if (isOnDashboard && isLoggedIn && !isAdmin) {
				console.log("Redirecting to error page");
				return Response.redirect(
					new URL(`/auth/error?error=PermissionLevelError`, nextUrl),
				);
			}

			return true;
		},
	},
} satisfies NextAuthConfig;
