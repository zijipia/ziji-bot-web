import { NextResponse } from "next/server";

export function middleware(request) {
	// Allow WebSocket connections
	if (request.headers.get("upgrade") === "websocket") {
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
