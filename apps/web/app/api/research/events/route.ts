import sheets from "..";

export async function POST(request: Request) {
	const res = await request.json();

	const { eventId, rating, comments } = res.data;

	if (rating || comments) {
		try {
			await sheets.spreadsheets.values.append({
				spreadsheetId: "1rg3N-XitWew8cF1bn-CBgWSnfso2d1gpr-DvnlgG82w",
				range: "A1:D1",
				valueInputOption: "USER_ENTERED",
				requestBody: {
					values: [[new Date().toISOString(), eventId, rating, comments]],
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
