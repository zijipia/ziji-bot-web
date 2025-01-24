"use client";

import { io } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";
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
	const [socketInstance, setSocketInstance] = useState(null);
	const [voiceChannel, setVoiceChannel] = useState(null);
	const [guildInfo, setGuildInfo] = useState(null);
	const [playerStats, setPlayerStats] = useState({
		currentTrack: null,
		playlist: [],
		isPlaying: false,
		volume: 50,
		duration: {
			current: "0:00",
			total: "0:00",
		},
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [showLyrics, setShowLyrics] = useState(false);
	const { data: session, status } = useSession();
	const { toast } = useToast();

	// Initialize Socket.IO connection
	useEffect(() => {
		if (session?.accessToken) {
			const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
				auth: {
					token: session.accessToken,
				},
			});

			socket.on("connect", () => {
				console.log("Socket connected");
				setSocketInstance(socket);
				socket.emit("GetVoice", session.user.id);
			});

			socket.on("ReplyVoice", (data) => {
				setVoiceChannel(data.channel);
				setGuildInfo(data.guild);
			});

			socket.on("statistics", (stats) => {
				setPlayerStats({
					currentTrack: stats.track,
					playlist: stats.queue || [],
					isPlaying: !stats.paused,
					volume: stats.volume,
					duration: {
						current: stats.timestamp?.current.label || "0:00",
						total: stats.timestamp?.total.label || "0:00",
					},
				});
			});

			socket.on("disconnect", () => {
				console.log("Socket disconnected");
				toast({
					title: "Disconnected",
					description: "Lost connection to the music bot. Please refresh the page.",
					variant: "destructive",
				});
			});

			return () => {
				if (socket) {
					socket.disconnect();
				}
			};
		}
	}, [session, toast]);

	const sendCommand = useCallback(
		(command) => {
			if (socketInstance?.connected && session?.user.id) {
				socketInstance.emit(command, { userID: session.user.id });
				toast({
					title: "Command Sent",
					description: `Sent ${command} command`,
				});
			} else {
				toast({
					title: "Error",
					description: "Not connected to voice channel",
					variant: "destructive",
				});
			}
		},
		[socketInstance, session, toast],
	);

	const handleVolumeChange = useCallback(
		(value) => {
			if (socketInstance?.connected) {
				socketInstance.emit("volume", value[0]);
			}
		},
		[socketInstance],
	);

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (!session) {
		return <p>Please login to control the music bot.</p>;
	}

	return (
		<div className='space-y-4'>
			<div className='flex space-x-4'>
				<section className='w-full md:w-2/3 rounded-lg shadow-lg p-6'>
					<div className='mb-6 relative'>
						<Input
							type='text'
							placeholder='Search for music...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pr-10'
						/>
						<FaSearch className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
					</div>

					<h2 className='text-xl font-semibold mb-4'>Queue</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[630px] overflow-y-auto'>
						{playerStats.playlist.map((track, index) => (
							<Card
								key={index}
								className='overflow-hidden'>
								<CardHeader className='p-4'>
									<CardTitle className='text-sm line-clamp-1'>{track.title}</CardTitle>
									<CardDescription className='text-xs'>{track.duration}</CardDescription>
								</CardHeader>
								<CardContent className='p-0'>
									<img
										src={track.thumbnail || "/placeholder.svg"}
										alt={track.title}
										className='w-full h-32 object-cover'
									/>
								</CardContent>
								<CardFooter className='p-4 flex justify-between'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => sendCommand("play")}>
										<FaPlay className='h-4 w-4' />
									</Button>
									<div className='flex gap-2'>
										<Button
											variant='ghost'
											size='icon'>
											<FaHeart className='h-4 w-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon'>
											<FaShareAlt className='h-4 w-4' />
										</Button>
									</div>
								</CardFooter>
							</Card>
						))}
					</div>
				</section>

				<aside className='w-full md:w-1/3 rounded-lg shadow-lg p-6'>
					<h2 className='text-xl font-semibold mb-4'>
						Now Playing {voiceChannel && `in ${voiceChannel.name}`}
					</h2>
					{playerStats.currentTrack ? (
						<div className='text-center'>
							<img
								src={playerStats.currentTrack.thumbnail || "/placeholder.svg"}
								alt={playerStats.currentTrack.title}
								className='w-full h-64 object-cover rounded-lg mb-4'
							/>
							<h3 className='text-lg font-semibold line-clamp-1'>
								{playerStats.currentTrack.title}
							</h3>
							<p className='text-sm text-muted-foreground mb-4'>
								{playerStats.duration.current} / {playerStats.duration.total}
							</p>

							<div className='flex justify-center items-center space-x-4 mb-6'>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => sendCommand("back")}>
									<FaStepBackward className='h-4 w-4' />
								</Button>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => sendCommand("pause")}>
									{playerStats.isPlaying ? (
										<FaPause className='h-4 w-4' />
									) : (
										<FaPlay className='h-4 w-4' />
									)}
								</Button>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => sendCommand("skip")}>
									<FaStepForward className='h-4 w-4' />
								</Button>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<FaVolumeUp className='h-4 w-4' />
									<Slider
										variant='ghost'
										value={[playerStats.volume]}
										onValueChange={handleVolumeChange}
										max={100}
										step={1}
									/>
								</div>
							</div>

							<div className='flex justify-center space-x-2 mt-4'>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => sendCommand("shuffle")}>
									<FaRandom className='h-4 w-4' />
								</Button>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => sendCommand("loop")}>
									<FaRedo className='h-4 w-4' />
								</Button>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => setShowLyrics(!showLyrics)}>
									<FaMusic className='h-4 w-4' />
								</Button>
							</div>

							{showLyrics && playerStats.currentTrack.lyrics && (
								<div className='mt-6 p-4 rounded-lg bg-muted max-h-64 overflow-y-auto'>
									<h4 className='font-semibold mb-2'>Lyrics</h4>
									<p className='whitespace-pre-line text-sm'>{playerStats.currentTrack.lyrics}</p>
								</div>
							)}
						</div>
					) : (
						<p className='text-center text-muted-foreground'>No track currently playing</p>
					)}
				</aside>
			</div>
		</div>
	);
}
