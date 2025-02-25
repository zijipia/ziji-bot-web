"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  FaTrash,
} from "react-icons/fa"
import { FaXmark } from "react-icons/fa6"
import { FaFacebook, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa"

import { Slider } from "./ui/slider"
import { Progress } from "./ui/progress"
import { ScrollArea } from "./ui/scroll-area"
import Loading from "./Loading"
import { LoginScreen } from "./Loginscreen"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MusicController() {
  const [connectionStatus, setConnectionStatus] = useState("Connecting")
  const [socket, setSocket] = useState(null)
  const [voiceChannel, setVoiceChannel] = useState(null)
  const [guildInfo, setGuildInfo] = useState(null)
  const [playerStats, setPlayerStats] = useState({
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    volume: 50,
    duration: {
      current: 0,
      total: 0,
    },
    repeatMode: 0,
    shuffle: false,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showLyrics, setShowLyrics] = useState(false)
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const progressInterval = useRef(null)
  const [searchHistory, setSearchHistory] = useState([])

  useEffect(() => {
    if (session?.accessToken) {
      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL

      const ws = new WebSocket(wsUrl)
      ws.onopen = () => {
        setConnectionStatus("Connected")
        setSocket(ws)
        ws.send(JSON.stringify({ event: "GetVoice", userID: session.user.id }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        switch (data.event) {
          case "statistics": {
            setPlayerStats({
              currentTrack: data.track,
              playlist: data.queue || [],
              isPlaying: !data.paused,
              volume: data.volume,
              duration: {
                current: data.timestamp?.current ?? 0,
                total: data.timestamp?.total ?? 0,
              },
              repeatMode: data.repeatMode,
              shuffle: data.shuffle,
            })
            break
          }
          case "ReplyVoice": {
            setVoiceChannel(data.channel)
            setGuildInfo(data.guild)
            break
          }
        }
      }

      ws.onclose = () => {
        setConnectionStatus("Disconnected")
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setConnectionStatus("Error")
      }

      return () => ws.close()
    }
  }, [session])

  useEffect(() => {
    if (playerStats.isPlaying) {
      progressInterval.current = setInterval(() => {
        setPlayerStats((prev) => ({
          ...prev,
          duration: {
            ...prev.duration,
            current: Math.min(prev.duration.current + 1000, prev.duration.total),
          },
        }))
      }, 1000)
    } else {
      clearInterval(progressInterval.current)
    }

    return () => clearInterval(progressInterval.current)
  }, [playerStats.isPlaying])

  useEffect(() => {
    // Load search history from localStorage when component mounts
    const savedHistory = localStorage.getItem("searchHistory")
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  const sendCommand = useCallback(
    (command, payload = {}) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event: command, userID: session?.user.id, ...payload }))
        toast({ title: "Command Sent", description: `Sent ${command} command` })
      } else {
        toast({ title: "Error", description: "Not connected to server", variant: "destructive" })
      }
    },
    [socket, session, toast],
  )

  const handleVolumeChange = useCallback((value) => {
    setPlayerStats((prev) => ({
      ...prev,
      volume: value[0],
    }))
  }, [])

  const handleVolumeCommit = useCallback(
    (value) => {
      sendCommand("volume", { volume: value[0] })
    },
    [sendCommand],
  )

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return

    try {
      const searchUrl = `${
        process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_WEBSOCKET_URL
      }/api/search?query=${encodeURIComponent(searchQuery)}`
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(searchUrl)}`

      const response = await fetch(proxyUrl)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Search failed")
      }

      const data = await response.json()
      setSearchResults(data)

      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter((q) => q !== searchQuery)].slice(0, 5)
      setSearchHistory(newHistory)
      localStorage.setItem("searchHistory", JSON.stringify(newHistory))
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: error.message || "Failed to perform search. Please try again.",
        variant: "destructive",
      })
    }
  }, [searchQuery, searchHistory, toast])

  const handleSearchCancel = () => {
    setSearchResults([])
  }

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":")
  }

  const handleShare = useCallback(
    (platform, track) => {
      const shareText = `Check out this track: ${track.title} by ${track.artist || track.author}`
      const shareUrl = track.url
      let shareLink

      switch (platform) {
        case "facebook":
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
          break
        case "twitter":
          shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`
          break
        case "whatsapp":
          shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + " " + decodeURIComponent(shareUrl))}`
          break
        case "copy":
          navigator.clipboard.writeText(`${decodeURIComponent(shareUrl)}`)
          toast({ title: "Link Copied", description: "Track link copied to clipboard" })
          return
        default:
          return
      }

      window.open(shareLink, "_blank")
    },
    [toast],
  )

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
    toast({
      title: "Search History Cleared",
      description: "Your search history has been cleared.",
    })
  }

  // Add this new function to handle clicking on a history item
  const handleHistoryClick = (query) => {
    setSearchQuery(query)
    handleSearch()
  }

  if (status === "loading") {
    return <Loading />
  }

  if (!session) {
    return <LoginScreen />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className={playerStats.currentTrack ? "md:col-span-2 space-y-6" : "md:col-span-3 space-y-6"}>
        <div className="rounded-2xl p-px bg-gradient-to-br  from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] dark:from-[hsl(var(--dark-gradient-start))] dark:to-[hsl(var(--dark-gradient-end))]">
          <Card className="rounded-[calc(1.0rem-1px)]  bg-slate-50 dark:bg-slate-950">
            <CardHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for music..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        return handleSearch()
                      }
                    }}
                    className="pr-10"
                  />
                  {searchResults.length <= 0 ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2"
                      onClick={handleSearch}
                    >
                      <FaSearch className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2"
                      onClick={handleSearchCancel}
                    >
                      <FaXmark className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {searchHistory.length > 0 && !searchResults.length && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Recent Searches</h4>
                      <Button size="sm" variant="ghost" onClick={clearSearchHistory}>
                        Clear History
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((query, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => handleHistoryClick(query)}
                        >
                          {query}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            {searchResults.length > 0 ? (
              <CardContent>
                <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                <ScrollArea className="h-[624px] pr-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.map((track, index) => (
                      <Card key={index} className="backdrop-blur-sm bg-background/80 dark:bg-background/40 flex">
                        <img
                          src={track.thumbnail || session.user?.image_url}
                          alt={track.title}
                          className="w-24 h-24 object-cover"
                        />
                        <div className="flex-1 p-4">
                          <h4 className="font-medium line-clamp-1">{track.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {track.duration} - {track.artist || track.author}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => sendCommand("play", { trackUrl: track.url })}
                            >
                              <FaPlay className="h-4 w-4" />
                            </Button>
                            <TooltipProvider>
                              <Button size="sm" variant="ghost">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FaHeart className="h-4 w-4" />
                                  </TooltipTrigger>
                                  <TooltipContent>Add to Favorites</TooltipContent>
                                </Tooltip>
                              </Button>
                            </TooltipProvider>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            ) : (
              <CardContent>
                <h3 className="text-lg font-semibold mb-4 text-center">Queue in {guildInfo?.name}</h3>
                {!playerStats.playlist.length && (
                  <div className="flex justify-center items-center h-full">Không có bài hát nào trong hàng đợi</div>
                )}
                <ScrollArea className="h-[628px] pr-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                    {playerStats.playlist.map((track, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-0">
                          <img
                            src={track.thumbnail || session.user?.image_url}
                            alt={track.title}
                            className="w-full h-32 object-cover"
                          />
                        </CardContent>
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm line-clamp-1">{track.title}</CardTitle>
                          <CardDescription className="text-xs">
                            <h4 className="font-medium line-clamp-1">{track.artist || track.author}</h4>
                            {track.duration}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 flex justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              sendCommand("Playnext", {
                                TrackPosition: index + 1,
                                trackUrl: track.url,
                              })
                            }
                          >
                            <FaPlay className="h-4 w-4" />
                          </Button>
                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => sendCommand("DelTrack", { TrackPosition: index + 1 })}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FaTrash className="h-4 w-4" />
                                  </TooltipTrigger>
                                  <TooltipContent>Remove from Queue</TooltipContent>
                                </Tooltip>
                              </Button>
                            </TooltipProvider>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <FaShareAlt className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleShare("facebook", track)}>
                                  <FaFacebook className="mr-2 h-4 w-4" /> Facebook
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare("twitter", track)}>
                                  <FaTwitter className="mr-2 h-4 w-4" /> Twitter
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare("whatsapp", track)}>
                                  <FaWhatsapp className="mr-2 h-4 w-4" /> WhatsApp
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare("copy", track)}>
                                  <FaLink className="mr-2 h-4 w-4" /> Copy Link
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
      {playerStats.currentTrack && (
        <div className="md:col-span-1">
          <div className="rounded-2xl p-px bg-gradient-to-br  from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] dark:from-[hsl(var(--dark-gradient-start))] dark:to-[hsl(var(--dark-gradient-end))]">
            <Card className="rounded-[calc(1.0rem-1px)]  bg-slate-50 dark:bg-slate-950">
              <CardHeader>
                <CardTitle>
                  Now Playing {voiceChannel && `in ${voiceChannel.name}`}
                  <Badge variant={connectionStatus === "Connected" ? "success" : "destructive"} className="ml-3">
                    {connectionStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <img
                      src={playerStats.currentTrack.thumbnail || session.user?.image_url}
                      alt={playerStats.currentTrack.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="space-y-2 text-center">
                    <h3 className="font-semibold line-clamp-1">{playerStats.currentTrack.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(playerStats.duration.current)} / {formatTime(playerStats.duration.total)}
                    </p>
                  </div>

                  <Progress value={(playerStats.duration.current / playerStats.duration.total) * 100} />

                  <div className="flex justify-center items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => sendCommand("back")}>
                      <FaStepBackward className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="icon" onClick={() => sendCommand("pause")}>
                      {playerStats.isPlaying ? <FaPause className="h-4 w-4" /> : <FaPlay className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => sendCommand("skip")}>
                      <FaStepForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaVolumeUp className="h-4 w-4" />
                      <Slider
                        value={[playerStats.volume]}
                        onValueChange={handleVolumeChange}
                        onValueCommit={handleVolumeCommit}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    <Button
                      variant={playerStats.shuffle ? "default" : "ghost"}
                      size="icon"
                      onClick={() => sendCommand("shuffle")}
                    >
                      <FaRandom className="h-4 w-4" />
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={playerStats.repeatMode !== 0 ? "default" : "ghost"}
                            size="icon"
                            onClick={() => sendCommand("loop", { mode: (playerStats.repeatMode + 1) % 4 })}
                          >
                            <FaRedo className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {playerStats.repeatMode === 0 && "Loop: Off"}
                          {playerStats.repeatMode === 1 && "Loop: Track"}
                          {playerStats.repeatMode === 2 && "Loop: Queue"}
                          {playerStats.repeatMode === 3 && "Loop: AutoPlay"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant={showLyrics ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setShowLyrics(!showLyrics)}
                    >
                      <FaMusic className="h-4 w-4" />
                    </Button>
                  </div>

                  {showLyrics && playerStats.currentTrack.lyrics && (
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Lyrics</h4>
                        <p className="whitespace-pre-line text-sm">{playerStats.currentTrack.lyrics?.plainLyrics}</p>
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}