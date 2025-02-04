import { NextResponse } from "next/server";

export function middleware(request) {
	console.log("Middleware called for:", request.url);

	if (request.headers.get("upgrade") === "websocket") {
		console.log("WebSocket upgrade request detected");
		return NextResponse.next();
	}

	console.log("Non-WebSocket request, proceeding normally");
	return NextResponse.next();
}

export const config = {
	matcher: ["/api/ws"],
};
