import { env } from "@ichess/env";
import { google } from "googleapis";

const SCOPES = [
	"https://www.googleapis.com/auth/spreadsheets",
	"https://www.googleapis.com/auth/drive.file",
];

export async function POST(request: Request) {
	const res = await request.json();

	const { registrationId, reason, discovery, discoveryOther } = res.data;

	if (reason && (discovery || discoveryOther)) {
		try {
			const auth = new google.auth.GoogleAuth({
				credentials: {
					client_email: env.GOOGLE_SHEET_CLIENT_EMAIL,
					private_key: env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, "\n"),
				},
				scopes: SCOPES,
			});

			const sheets = google.sheets({
				auth,
				version: "v4",
			});

			await sheets.spreadsheets.values.append({
				spreadsheetId: process.env.GOOGLE_SHEET_ID,
				range: "A1:D1",
				valueInputOption: "USER_ENTERED",
				requestBody: {
					values: [
						[
							new Date().toISOString(),
							registrationId,
							reason,
							discovery !== "other" ? discovery : `Outro: ${discoveryOther}`,
						],
					],
				},
			});

			console.log("Data sent to Google Sheets.");
		} catch (error) {
			console.error(error);
			return new Response(`Error: ${error}`, { status: 500 });
		}
	} else {
		return new Response("Error: Invalid data.", { status: 400 });
	}

	return new Response("Success!", { status: 200 });
}
