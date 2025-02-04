// import { MusicController } from "@/components/music-controller";
// import { Header } from "@/components/header";

// export default function Home() {
// 	return (
// 		<div className='min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] dark:from-[hsl(var(--dark-gradient-start))] dark:to-[hsl(var(--dark-gradient-end))]'>
// 			<Header />
// 			<main className='container mx-auto p-4'>
// 				<MusicController />
// 			</main>
// 		</div>
// 	);
// }

"use client";
import { useEffect, useState } from "react";

export default function Home() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	let socket;

	useEffect(() => {
		socket = new WebSocket("ws://localhost:3000/api/ws");

		socket.onopen = () => console.log("WebSocket connected");
		socket.onmessage = (event) => {
			setMessages((prev) => [...prev, event.data]);
		};
		socket.onclose = () => console.log("WebSocket disconnected");

		return () => socket.close();
	}, []);

	const sendMessage = () => {
		if (socket && input) {
			socket.send(input);
			setInput("");
		}
	};

	return (
		<div>
			<h1>WebSocket Chat</h1>
			<ul>
				{messages.map((msg, i) => (
					<li key={i}>{msg}</li>
				))}
			</ul>
			<input
				type='text'
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder='Type a message'
			/>
			<button onClick={sendMessage}>Send</button>
		</div>
	);
}
