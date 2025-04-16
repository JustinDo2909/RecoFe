import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "../state/socket";
import { useUpdateStatusRequestMutation } from "../state/api";  // Giả sử bạn có một endpoint trong RTK Query để cập nhật trạng thái đơn hàng

export const useWebSocket = () => {
  const [updateRequest, { isLoading, isError, isSuccess }] = useUpdateStatusRequestMutation();

  useEffect(() => {
    // Lắng nghe sự kiện từ WebSocket
    socket.on("statusUpdated", (updatedStatus) => {
      console.log("Status updated:", updatedStatus);

      // Gọi trực tiếp mutation để cập nhật trạng thái
      updateRequest({ id: updatedStatus.id, status: updatedStatus.status });
    });

    // Dọn dẹp khi component unmount
    return () => {
      socket.off("statusUpdated");
    };
  }, [updateRequest]);

  // Có thể xử lý các trạng thái như loading, error, success ở đây
  if (isLoading) {
    console.log("Updating status...");
  }

  if (isError) {
    console.log("Error updating status.");
  }

  if (isSuccess) {
    console.log("Status updated successfully.");
  }
};
