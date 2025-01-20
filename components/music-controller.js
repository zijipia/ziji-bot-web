"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./auth-provider";
import { useToast } from "@/hooks/use-toast";

export function MusicController() {
  const [socket, setSocket] = useState(null);
  const [channelId, setChannelId] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        // Handle incoming messages (e.g., bot status updates)
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setSocket(null);
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, [user]);

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
        description: "Please enter a channel ID and ensure you're connected",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <p>Please login to control the music bot.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter Channel ID"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />
        <Button onClick={() => sendCommand("join")}>Join Channel</Button>
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => sendCommand("play")}>Play</Button>
        <Button onClick={() => sendCommand("pause")}>Pause</Button>
        <Button onClick={() => sendCommand("skip")}>Skip</Button>
        <Button onClick={() => sendCommand("stop")}>Stop</Button>
      </div>
    </div>
  );
}
