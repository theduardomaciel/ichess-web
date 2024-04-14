import { NextResponse } from "next/server";

/* export { auth as middleware } from "@ichess/auth"; */

export function middleware() {
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)"],
};
