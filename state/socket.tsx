import { io } from "socket.io-client";

const socket = io("http://localhost:9999");  // URL của server WebSocket của bạn

// Lắng nghe sự kiện từ server
socket.on("statusUpdated", (updatedStatus) => {
  console.log("Updated Status:", updatedStatus);
  // Dispatch action to update Redux store or trigger RTK Query refetch
});

export default socket;
