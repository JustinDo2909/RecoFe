import { Order, User } from "@/types";
import { Palette } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import PriceFormatter from "./PriceFormatter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Props {
  order: Order | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const idCustom = "684a85aa1d6c9de849557543";

const OrderDetailsDialog: FC<Props> = ({ order, isOpen, onClose }) => {
  const router = useRouter();

  console.log("order", order);
  if (!order) return null;
  console.log("order", order);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng - {order?._id}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-1">
          <p>
            <strong>Ngày:</strong>
            {order?.createdAt &&
              new Date(order?.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Trạng thái:</strong>
            <span className="capitalize text-green-600 font-medium">
              {(() => {
                switch (order?.statusOrder) {
                  case "Processing":
                    return "Đang xử lý";
                  case "Shipping":
                    return "Đang giao hàng";
                  case "Done":
                    return "Hoàn thành";
                  case "Refund Approved":
                    return "Đã chấp nhận hoàn tiền";
                  case "Cancel":
                    return "Đã hủy";
                  case "Refund Requested":
                    return "Yêu cầu hoàn tiền";
                  case "Refund Rejected":
                    return "Từ chối hoàn tiền";
                  default:
                    return "Không xác định";
                }
              })()}
            </span>
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Phí giao hàng</TableHead>
              <TableHead>Giá</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order?.items?.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={product?.picture || ""}
                      alt="productImage"
                      width={50}
                      height={50}
                      className="border rounded-sm w-14 h-14 object-contain"
                    />
                    <p className="line-clamp-1">{product?.name || ""}</p>
                  </div>

                  {(typeof product.productId === "string"
                    ? product.productId === idCustom
                    : product.productId === idCustom) && (
                    <button
                      onClick={() =>
                        router.push(`/customeBag/${product.productId}`)
                      }
                      className="flex items-center gap-1 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-md hover:from-purple-700 hover:to-pink-700 transition-all duration-300 mt-1"
                    >
                      <Palette className="h-4 w-4" />
                      Tùy chỉnh thiết kế
                    </button>
                  )}
                </TableCell>

                <TableCell>{product?.quantity}</TableCell>
                <TableCell>{order?.feeShipping} đ</TableCell>
                <TableCell>{(product as any)?.price} đ</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {order?.items?.some((item) =>
          typeof item.productId === "string"
            ? item.productId === idCustom
            : (item as any).productId?._id === idCustom
        )}

        <div className="mt-4 text-right flex items-center justify-end">
          <div className="w-44 flex flex-col gap-1">
            <div className="w-full flex items-center justify-between">
              <strong>Tổng đơn:</strong>
              <PriceFormatter
                amount={order?.totalPrice}
                className="text-black font-bold"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
