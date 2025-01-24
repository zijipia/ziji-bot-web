"use client";

import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

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
	const [duration, setDuration] = useState({
		current: "0:00",
		total: "0:00",
	});
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
			const wss = new io("http://localhost:2003", {
				auth: {
					token: session.accessToken,
				},
			});
			wss.on("connect", () => {
				console.log("WebSocket connected");
				setSocket(socket);
				wss.emit("GetVoice", session.user.id);
			});

			wss.on("ReplyVoice", (data) => {
				setVoiceChannels(data.channel);
				setGuild(data.guild);
			});

			wss.on("statistics", async (statistics) => {
				setStatistics(statistics);
				setDuration({
					current: statistics.timestamp?.current.label ?? "0:00",
					total: statistics.timestamp?.total.label ?? "0:00",
				});
				console.log(statistics);
			});

			wss.on("disconnect", () => {
				console.log("WebSocket disconnect");
				setSocket(null);
				toast({
					title: "Disconnected",
					description: "Lost connection to the music bot. Please refresh the page.",
					variant: "destructive",
				});
			});

			wss.on("connect_error", (error) => {
				console.error("WebSocket error:", error);
				toast({
					title: "Connection Error",
					description: "Failed to connect to the music bot. Please try again later.",
					variant: "destructive",
				});
			});

			return () => {
				if (wss.readyState === WebSocket.OPEN) {
					wss.close();
				}
			};
		}
	}, [session]);

	useEffect(() => {
		setCurrentTrack(statistics.track);
		setPlaylist(statistics.queue);
		setMounted(true);
		setIsPlaying(!statistics.paused);
	}, [statistics]);

	if (!mounted) return null;

	const handleVolumeChange = (e) => setVolume(e.target.value);
	const handleSearch = (e) => setSearchQuery(e.target.value);
	const toggleLyrics = () => setShowLyrics(!showLyrics);

	const sendCommand = (command) => {
		if (socket && socket.readyState === WebSocket.OPEN && session.user.id) {
			socket.send(JSON.stringify({ command, userID: session.user.id }));
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
									<Card>
										<CardHeader>
											<CardTitle>{track.title}</CardTitle>
											<CardDescription>{track.artist}</CardDescription>
										</CardHeader>
										<CardContent>
											<img
												src={track.thumbnail}
												alt={track.title}
												className='w-full h-48 object-cover'
											/>
										</CardContent>
										<CardFooter>
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
											</div>{" "}
										</CardFooter>
									</Card>
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
									onClick={sendCommand("pause")}>
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
		</div>
	);
}
