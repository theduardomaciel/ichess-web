import { z } from "zod";

import { qstash } from "./client";

export type * from "@upstash/qstash";
export { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

export const qStashEventSchema = z.enum(["USE_VERIFICATION_CODE"]);

export const qStashPayloadSchema = z.object({
	codeId: z.string(),
});

export type QStashEvent = z.infer<typeof qStashEventSchema>;
export type QStashPayload = z.infer<typeof qStashPayloadSchema>;

export async function markVerificationCode({
	event,
	payload,
	delayInSeconds = 0,
}: {
	event: QStashEvent;
	payload: QStashPayload;
	delayInSeconds?: number;
}) {
	await qstash.publishJSON({
		url: "https://abundant-eve-39.webhook.cool",
		contentBasedDeduplication: true,
		body: {
			event,
			payload,
		},
		delay: delayInSeconds,
	});
}
