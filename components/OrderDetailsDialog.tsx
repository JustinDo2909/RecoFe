import { Order, User } from "@/types";
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
import Image from "next/image";

interface Props {
  order: Order | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsDialog: FC<Props> = ({ order, isOpen, onClose }) => {
  console.log("order", order);
  if (!order) return null;
  console.log('order', order)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng - {order?._id}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-1">
          {/* <p>
            <strong>Customer:</strong> {user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p> */}
          <p>
            <strong>Ngày:</strong>
            {order?.createdAt &&
              new Date(order?.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Trạng thái:</strong>
            <span className="capitalize text-green-600 font-medium">
              {order?.statusOrder}
            </span>
          </p>
          {/* <p>
            <strong>Invoice Number:</strong> {order?.invoice?.number}
          </p> */}
          {/* {order?.invoice && (
            <Button variant="outline" className="mt-2">
              {order?.invoice?.hosted_invoice_url && (
                <Link href={order?.invoice?.hosted_invoice_url} target="blank">
                  Download Invoice
                </Link>
              )}
            </Button>
          )} */}
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
                <TableCell className="flex items-center gap-2">
                  <Image
                    src={product?.picture}
                    alt="productImage"
                    width={50}
                    height={50}
                    className="border rounded-sm w-14 h-14 object-contain"
                  />

                  <p className=" line-clamp-1">{product?.name || ""}</p>

                
                </TableCell>
                <TableCell>{product?.quantity}</TableCell>
                <TableCell>{order?.feeShipping} đ</TableCell>
                <TableCell>{product?.finalPrice} đ</TableCell>
                {/* {product?.product?.price && product?.quantity && (
                  <TableCell>
                    <PriceFormatter
                      className="text-black font-medium"
                      amount={product?.product?.price * product?.quantity}
                    />
                  </TableCell>
                )} */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-right flex items-center justify-end">
          <div className="w-44 flex flex-col gap-1">
            {/* {order?.amountDiscount !== 0 && (
              <div className="w-full flex items-center justify-between">
                <strong>Subtotal</strong>
                <PriceFormatter
                  amount={
                    (order?.totalPrice as number) +
                    (order?.amountDiscount as number)
                  }
                />
              </div>
            )}
            {order?.amountDiscount !== 0 && (
              <div className="w-full flex items-center justify-between">
                <strong>Discount</strong>
                <PriceFormatter amount={order?.amountDiscount} />
              </div>
            )} */}

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
