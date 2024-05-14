import { db } from "@ichess/drizzle";

// Types
import type { TRPCError } from "@trpc/server";

interface Props {
	projectId?: string;
	userId?: string;
}

export async function isMemberAuthenticated({ projectId, userId }: Props) {
	let error:
		| {
				message: string;
				code: TRPCError["code"];
		  }
		| undefined;

	if (!userId || !projectId) {
		error = {
			message: "Request user not found.",
			code: "BAD_REQUEST",
		};
		return error;
	}

	const member = await db.query.member.findFirst({
		where(fields, { and, eq }) {
			return and(
				eq(fields.projectId, projectId),
				eq(fields.userId, userId),
				eq(fields.role, "admin"),
			);
		},
	});

	if (!member) {
		error = {
			message: "User has no permission to update the event.",
			code: "FORBIDDEN",
		};
		return error;
	}
}
