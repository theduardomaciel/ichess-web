import { env } from "@ichess/env";
import {
	markVerificationCode,
	qStashEventSchema,
	qStashPayloadSchema,
	verifySignatureAppRouter,
} from "@ichess/qstash";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 300;
export const preferredRegion = "cle1";

export class WebhookError extends Error {}

export const qstashWebhookSchema = z.object({
	event: qStashEventSchema,
	payload: qStashPayloadSchema,
});

async function handler(request: NextRequest) {
	const requestBody = await request.json();
	const webhookId = crypto.randomUUID();

	const { event, payload } = qstashWebhookSchema.parse(requestBody);
	const { codeId } = payload;

	try {
		await markVerificationCode({
			event,
			payload: { codeId },
			delayInSeconds: 10,
		});

		return new NextResponse(null, { status: 204 });
	} catch (err) {
		if (err instanceof WebhookError) {
			return NextResponse.json({ message: err.message }, { status: 400 });
		}

		return NextResponse.json(
			{ message: `Unexpected error (Webhook ID: "${webhookId}")` },
			{ status: 500 },
		);
	}
}

console.log("env.QSTASH_VALIDATE_SIGNATURE", env.QSTASH_VALIDATE_SIGNATURE);

/* export const POST = env.QSTASH_VALIDATE_SIGNATURE
	? verifySignatureAppRouter(handler)
	: handler; */
export const POST = handler;
