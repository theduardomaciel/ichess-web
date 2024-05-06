import { env } from "@ichess/env";
import { google } from "googleapis";

const SCOPES = [
	"https://www.googleapis.com/auth/spreadsheets",
	"https://www.googleapis.com/auth/drive.file",
];

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

export default sheets;
