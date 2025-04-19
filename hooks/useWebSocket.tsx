// hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:9999");

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};
