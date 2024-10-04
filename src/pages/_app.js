import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import { Inter } from "next/font/google";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SocketContextProvider, useSocket } from "@/context/socket.context";
import { InvalidSession } from "@/components/auth/InvalidSession";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ziji bot - Player panel",
  description: "A player panel for Ziji bot",
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { socket } = useSocket();
  const [invalidSession, setInvalidSession] = useState(true);

  useEffect(() => {
    const onConnect = () => {
      setInvalidSession(false);
    };

    const onError = () => {
      setInvalidSession(true);
    };

    const onSession = (session) => {
      sessionStorage.setItem("session", JSON.stringify(session));
    };

    if (!socket.connected) {
      const token = router.query.session || "1234";
      if (!token) return setInvalidSession(true);

      sessionStorage.setItem("token", token);

      // @ts-expect-error
      socket.on("ready", onSession);

      socket.on("connect", onConnect);
      socket.on("connect_error", onError);

      socket.connect();
    }

    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
      // @ts-expect-error
      socket.off("ready", onSession);
    };
  }, [router.query.session, socket]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SocketContextProvider>
        <div className={inter.className}>
          {!invalidSession ? (
            <InvalidSession />
          ) : (
            <TooltipProvider>
              <Component {...pageProps} />
            </TooltipProvider>
          )}
        </div>
      </SocketContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
