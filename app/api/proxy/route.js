import { NextResponse } from "next/server";

export async function GET(request) {
	const searchParams = request.nextUrl.searchParams;
	const url = searchParams.get("url");

	if (!url) {
		return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
	}

	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": "Discord-Music-Bot-Controller/1.0",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			const data = await response.json();
			return NextResponse.json(data);
		} else {
			const text = await response.text();
			return new NextResponse(text, {
				status: response.status,
				headers: {
					"Content-Type": contentType || "text/plain",
				},
			});
		}
	} catch (error) {
		console.error("Proxy error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch data", details: error.message },
			{ status: 500 },
		);
	}
}

export async function POST(request) {
	const searchParams = request.nextUrl.searchParams;
	const url = searchParams.get("url");

	if (!url) {
		return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
	}

	try {
		console.log(`Proxying POST request to: ${url}`);
		const body = await request.json();
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "Discord-Music-Bot-Controller/1.0",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			const data = await response.json();
			return NextResponse.json(data);
		} else {
			const text = await response.text();
			return new NextResponse(text, {
				status: response.status,
				headers: {
					"Content-Type": contentType || "text/plain",
				},
			});
		}
	} catch (error) {
		console.error("Proxy error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch data", details: error.message },
			{ status: 500 },
		);
	}
}
