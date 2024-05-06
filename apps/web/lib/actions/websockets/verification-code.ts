"use server";

import { env } from "@ichess/env";

export async function markVerificationCode({
	verificationCode,
}: { verificationCode: string }) {
	"use server";

	const Pusher = require("pusher");

	const pusher = new Pusher({
		appId: env.PUSHER_APP_ID,
		cluster: env.PUSHER_CLUSTER,
		key: env.NEXT_PUBLIC_PUSHER_KEY,
		secret: env.PUSHER_SECRET,
	});

	try {
		console.log("Marking verification code as used:", verificationCode);
		console.log(pusher);

		await pusher.trigger("verification-channel", "use-verification-code", {
			verificationCode,
		});

		return true;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to use verification code");
	}
}
