"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function MusicController() {
	const [socket, setSocket] = useState(null);
	const [channelId, setChannelId] = useState("");
	const [voiceChannels, setVoiceChannels] = useState([]);
	const { data: session, status } = useSession();
	const { toast } = useToast();

	useEffect(() => {
		if (session) {
			const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
			fetchVoiceChannels();

			ws.onopen = () => {
				console.log("WebSocket connected");
				setSocket(ws);
				// Fetch voice channels when connected
				fetchVoiceChannels();
			};

			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				console.log("Received message:", data);
				// Handle incoming messages (e.g., bot status updates)
			};

			ws.onclose = () => {
				console.log("WebSocket disconnected");
				setSocket(null);
				toast({
					title: "Disconnected",
					description: "Lost connection to the music bot. Please refresh the page.",
					variant: "destructive",
				});
			};

			ws.onerror = (error) => {
				console.error("WebSocket error:", error);
				toast({
					title: "Connection Error",
					description: "Failed to connect to the music bot. Please try again later.",
					variant: "destructive",
				});
			};

			return () => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.close();
				}
			};
		}
	}, [session, toast]);

	const fetchVoiceChannels = async () => {
		try {
			const response = await fetch("/api/voice-channels");
			if (response.ok) {
				const channels = await response.json();
				setVoiceChannels(channels);
			} else {
				throw new Error("Failed to fetch voice channels");
			}
		} catch (error) {
			console.error("Error fetching voice channels:", error);
			toast({
				title: "Error",
				description: "Failed to fetch voice channels. Please try again.",
				variant: "destructive",
			});
		}
	};

	const sendCommand = (command) => {
		if (socket && socket.readyState === WebSocket.OPEN && channelId) {
			socket.send(JSON.stringify({ command, channelId }));
			toast({
				title: "Command Sent",
				description: `Sent ${command} command to channel ${channelId}`,
			});
		} else {
			toast({
				title: "Error",
				description: "Please select a voice channel and ensure you're connected",
				variant: "destructive",
			});
		}
	};

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (!session) {
		return <p>Please login to control the music bot.</p>;
	}

	return (
		<div className='space-y-4'>
			<div className='flex space-x-2'>
				<Select
					onValueChange={setChannelId}
					value={channelId}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Select voice channel' />
					</SelectTrigger>
					<SelectContent>
						{voiceChannels.map((channel) => (
							<SelectItem
								key={channel.id}
								value={channel.id}>
								{channel.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button onClick={() => sendCommand("join")}>Join Channel</Button>
			</div>
			<div className='flex space-x-2'>
				<Button onClick={() => sendCommand("play")}>Play</Button>
				<Button onClick={() => sendCommand("pause")}>Pause</Button>
				<Button onClick={() => sendCommand("skip")}>Skip</Button>
				<Button onClick={() => sendCommand("stop")}>Stop</Button>
			</div>
		</div>
	);
}
