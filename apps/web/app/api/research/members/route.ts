import sheets from "..";

export async function POST(request: Request) {
	const res = await request.json();

	const { registrationId, reason, discovery, discoveryOther } = res.data;

	if (reason && (discovery || discoveryOther)) {
		try {
			await sheets.spreadsheets.values.append({
				spreadsheetId: "1EjRbDpi-sSIqYHIQTp08e85h258vftaHsazHac84bfg",
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
