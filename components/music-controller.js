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

import {
	FaPlay,
	FaPause,
	FaStepForward,
	FaStepBackward,
	FaVolumeUp,
	FaHeart,
	FaShareAlt,
	FaSearch,
	FaRandom,
	FaRedo,
	FaMusic,
} from "react-icons/fa";
import { Slider } from "./ui/slider";

export function MusicController() {
	const [socket, setSocket] = useState(null);
	const [guild, setGuild] = useState("");
	const [voiceChannels, setVoiceChannels] = useState([]);
	const [statistics, setStatistics] = useState({});
	const [tracks, setTrack] = useState([]);
	const { data: session, status } = useSession();
	const { toast } = useToast();

	const [currentTrack, setCurrentTrack] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(50);
	const [searchQuery, setSearchQuery] = useState("");
	const [playlist, setPlaylist] = useState([]);
	const [showLyrics, setShowLyrics] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if (session) {
			const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);

			ws.onopen = () => {
				console.log("WebSocket connected");
				setSocket(ws);
				// ws.emit("GetVoice", session.user.id);

				ws.send(JSON.stringify({ command: "GetVoice", userID: session.user.id }));
				// Fetch voice channels when connected
				// fetchVoiceChannels();
			};

			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				// console.log("Received message:", data);
				switch (data.command) {
					case "ReplyVoice":
						{
							setVoiceChannels(data.channel);
							setGuild(data?.guild ?? data?.channel?.guild);
						}
						break;
					case "statistics": {
						setStatistics(data.statistics);
						console.log(data.statistics);
					}
				}
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

	useEffect(() => {
		setCurrentTrack(statistics.track);
		setPlaylist(statistics.queue);
		setMounted(true);
		setIsPlaying(!statistics.paused);
	}, [statistics]);

	if (!mounted) return null;

	const togglePlay = () => sendCommand("pause");
	const handleVolumeChange = (e) => setVolume(e.target.value);
	const handleSearch = (e) => setSearchQuery(e.target.value);
	const toggleLyrics = () => setShowLyrics(!showLyrics);

	const sendCommand = (command) => {
		if (socket && socket.readyState === WebSocket.OPEN && session.user.id) {
			socket.send(JSON.stringify({ command, userID: session.user.id }));
			// toast({
			// 	title: "Command Sent",
			// 	description: `Sent ${command} command to User ${session.user.username}`,
			// });
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
				<section className='w-full md:w-2/3 rounded-lg shadow-lg p-6'>
					<div className='mb-6 relative'>
						<Input
							type='text'
							placeholder='Search for music...'
							className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400'
							value={searchQuery}
							onChange={handleSearch}
						/>
						<FaSearch className='absolute top-3 right-3 text-gray-400' />
					</div>
					<h2 className='text-xl font-semibold mb-4'>Queue</h2>
					<div className='max-h-[630px] overflow-y-auto'>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{playlist?.map((track, indexx) => (
								<div
									key={indexx}
									className=' rounded-lg overflow-hidden shadow-md'>
									<img
										src={track.thumbnail}
										alt={track.title}
										className='w-full h-48 object-cover'
									/>
									<div className='p-4'>
										<h3 className='font-semibold'>{track.title}</h3>
										<p className='text-sm text-gray-600'>{track.artist}</p>
										<div className='mt-2 flex justify-between items-center'>
											<button className='text-indigo-600 hover:text-indigo-800'>
												<FaPlay />
											</button>
											<div>
												<button className='text-gray-600 hover:text-gray-800 mr-2'>
													<FaHeart />
												</button>
												<button className='text-gray-600 hover:text-gray-800'>
													<FaShareAlt />
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<aside className='w-full md:w-1/3  rounded-lg shadow-lg p-6'>
					<h2 className='text-xl font-semibold mb-4'>Now Playing at {voiceChannels?.name}</h2>
					{currentTrack && (
						<div className='text-center'>
							<img
								src={currentTrack.thumbnail}
								alt={currentTrack.title}
								className='w-full h-64 object-cover rounded-lg mb-4'
							/>
							<h3 className='text-lg font-semibold'>{currentTrack.title}</h3>
							<p className='text-gray-600'>{currentTrack.artist}</p>
							<p className='text-sm text-gray-500 mb-4'>{currentTrack.album}</p>
							<div className='flex justify-center items-center space-x-4 mb-4'>
								<button className='text-gray-600 hover:text-gray-800'>
									<FaStepBackward />
								</button>
								<button
									className='text-indigo-600 hover:text-indigo-800 text-3xl'
									onClick={togglePlay}>
									{isPlaying ? <FaPause /> : <FaPlay />}
								</button>
								<button className='text-gray-600 hover:text-gray-800'>
									<FaStepForward />
								</button>
							</div>
							<div className='flex items-center mb-4'>
								<FaVolumeUp className='text-gray-600 mr-2' />
								<Input
									type='range'
									min='0'
									max='100'
									value={volume}
									onChange={handleVolumeChange}
									className='w-full'
								/>
							</div>
							<div className='mt-4 flex justify-center space-x-4'>
								<button className='text-gray-600 hover:text-gray-800'>
									<FaRandom />
								</button>
								<button className='text-gray-600 hover:text-gray-800'>
									<FaRedo />
								</button>
								<button
									className='text-gray-600 hover:text-gray-800'
									onClick={toggleLyrics}>
									<FaMusic />
								</button>
							</div>
							{showLyrics && (
								<div className='mt-6 p-4 rounded-lg max-h-64 overflow-y-auto'>
									<h4 className='font-semibold mb-2'>Lyrics</h4>
									<p className='whitespace-pre-line text-sm text-gray-700'>{currentTrack.lyrics}</p>
								</div>
							)}
						</div>
					)}
				</aside>
			</div>
			{/* <div className='flex space-x-2'>
				<Button
					variant='outline'
					onClick={() => sendCommand("play")}>
					Play
				</Button>
				<Button
					variant='outline'
					onClick={() => sendCommand("pause")}>
					Pause
				</Button>
				<Button
					variant='outline'
					onClick={() => sendCommand("skip")}>
					Skip
				</Button>
				<Button
					variant='outline'
					onClick={() => sendCommand("stop")}>
					Stop
				</Button>
			</div> */}
		</div>
	);
}
