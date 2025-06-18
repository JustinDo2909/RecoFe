import { io } from "socket.io-client";

const socket = io("https://deployexe-be-1.onrender.com"); // URL của server WebSocket của bạn

// Lắng nghe sự kiện từ server
socket.on("statusUpdated", (updatedStatus) => {
  console.log("Updated Status:", updatedStatus);
  // Dispatch action to update Redux store or trigger RTK Query refetch
});

export default socket;
