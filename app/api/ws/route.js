import { io } from "socket.io-client";
import { WebSocketPair } from "next/server";

const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
const connections = new Map();

export async function GET(request) {
	console.log("WebSocket connection attempt received");

	const upgradeHeader = request.headers.get("upgrade");
	if (upgradeHeader !== "websocket") {
		console.log("Non-WebSocket request received");
		return new Response("Expected Upgrade: websocket", { status: 426 });
	}

	try {
		const clientId = request.cookies.get("next-auth.session-token")?.value || "";
		console.log("Client ID:", clientId);

		let socket = connections.get(clientId);
		if (!socket) {
			console.log("Creating new Socket.IO connection to:", socketUrl);
			socket = io(socketUrl, {
				transports: ["websocket"],
				auth: {
					token: clientId,
				},
			});
			connections.set(clientId, socket);

			socket.on("connect", () => {
				console.log("Socket.IO connected");
			});

			socket.on("disconnect", () => {
				console.log("Socket.IO disconnected");
				connections.delete(clientId);
			});

			socket.on("connect_error", (error) => {
				console.error("Socket.IO connection error:", error);
			});
		}

		const { response, socket: serverSocket } = new WebSocketPair();

		serverSocket.accept();
		serverSocket.addEventListener("message", async (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log("Received message from client:", data);
				socket.emit(data.event, data.payload);
			} catch (error) {
				console.error("Error processing client message:", error);
			}
		});

		socket.onAny((event, ...args) => {
			try {
				console.log("Received event from Socket.IO:", event);
				serverSocket.send(JSON.stringify({ event, payload: args[0] }));
			} catch (error) {
				console.error("Error sending message to client:", error);
			}
		});

		console.log("WebSocket connection established");
		return response;
	} catch (error) {
		console.error("WebSocket proxy error:", error);
		return new Response("WebSocket proxy error", { status: 500 });
	}
}
