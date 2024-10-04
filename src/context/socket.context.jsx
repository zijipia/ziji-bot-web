import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_GATEWAY_URL, {
  auth(cb) {
    cb({
      token: sessionStorage.getItem("token"),
    });
  },
  autoConnect: false,
});

const SocketContext = createContext(socket);

export function SocketContextProvider({ children }) {
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    const onConnect = () => {
      setConnecting(false);
    };

    const onDisconnect = () => {
      setConnecting(false);
    };

    const onError = () => {
      setConnecting(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {connecting ? (
        <div className="fixed inset-0 grid place-items-center bg-background">
          <p className="text-lg text-foreground">Connecting...</p>
        </div>
      ) : (
        children
      )}
    </SocketContext.Provider>
  );
}

export function useSocketEvent(name, handler) {
  const { socket } = useSocket();

  useEffect(() => {
    socket.on(name, handler);

    return () => {
      socket.off(name, handler);
    };
  }, [name, handler, socket]);
}

export function useSocket() {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within SocketContextProvider");
  }

  const send = useCallback(
    (name, ...params) => {
      return void socket.emit(name, ...params);
    },
    [socket]
  );

  return { socket, send };
}
