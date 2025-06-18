"use client";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccessToCart from "@/components/NoAccessToCart";
import PriceFormatter from "@/components/PriceFormatter";
import PriceView from "@/components/PriceView";
import QuantityButtons from "@/components/QuantityButtons";
import { SelectFiled } from "@/components/SelectFiled";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/hooks/useUser";
import { useSocket } from "@/hooks/useWebSocket";
import paypalLogo from "@/images/paypalLogo.png";
import {
  useCreateOrderMutation,
  useDeleteAllProductToCardMutation,
  useDeleteProductToCartByIdMutation,
  useGetCardQuery,
  useGetWalletQuery,
  useWalletPayMutation,
} from "@/state/api";
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetShippingFeeMutation,
  useGetWardsQuery,
} from "@/state/apiGHN";
import useCartStore from "@/store";
import {
  BanknoteIcon,
  DollarSign,
  ShoppingBag,
  Trash,
  WalletIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deleteCartProduct, getTotalPrice, getSubtotalPrice } = useCartStore();
  const [deleteProductToCartById] = useDeleteProductToCartByIdMutation();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setIsClient(true);
    }
  }, [user]);
  const { data: cartProducts = [], refetch: cartRefetch } = useGetCardQuery();
  const [deleteAllCart] = useDeleteAllProductToCardMutation();
  const [itemCount, setItemCount] = useState(0);
  const [districSelected, setDistricSelected] = useState("");
  const [provinceSelected, setProvinceSelected] = useState("");
  const [wardSelected, setWardSelected] = useState("");
  const [feeShipping, setFeeShipping] = useState(0);
  const [getFeeShipping] = useGetShippingFeeMutation();
  const [createOrder] = useCreateOrderMutation();
  const [payByWallet] = useWalletPayMutation();
  const [deleteAllProduct] = useDeleteAllProductToCardMutation();
  const { data: province } = useGetProvincesQuery({});
  const { data: district } = useGetDistrictsQuery(
    {
      provinceId: provinceSelected ? parseInt(provinceSelected) : 0,
    },
    {
      skip: !provinceSelected,
    },
  );
  const { data: ward } = useGetWardsQuery(
    { districtId: districSelected ? parseInt(districSelected) : 0 },
    { skip: !districSelected },
  );
  const { data: wallet, refetch: refetchWallet } = useGetWalletQuery({});
  const [address, setAddress] = useState("");
  const socket = useSocket();
  console.log("", itemCount);
  useEffect(() => {
    if (!socket) return;
    const handler = (wallet: { refundAmount: number }) => {
      refetchWallet();
      toast.success(`Bạn vừa được hoàn ${wallet.refundAmount} VNĐ vào ví!`);
    };
    socket.on("refundToWallet", handler);

    return () => {
      socket.off("refundToWallet", handler);
    };
  }, [socket, refetchWallet]);

  useEffect(() => {
    const fetchFee = async () => {
      if (wardSelected && districSelected) {
        const fromDistrictId = parseInt(districSelected);
        const fromWardCode = parseInt(wardSelected);

        if (!isNaN(fromDistrictId) && !isNaN(fromWardCode)) {
          try {
            const res = await getFeeShipping({
              service_type_id: 2,
              to_ward_code: wardSelected,
              to_district_id: fromDistrictId,
              weight: 1000,
              items: [
                {
                  name: "TEST1",
                  quantity: 1,
                  length: 200,
                  width: 200,
                  height: 200,
                  weight: 1000,
                },
              ],
            });

            setFeeShipping(res.data.data.total);
            console.log(res.data.data.total);
          } catch {}
        }
      }
    };

    fetchFee();
  }, [wardSelected, districSelected, getFeeShipping]);

  const handleResetCart = async () => {
    const confirmed = window.confirm("Bạn có chắc không?");
    if (confirmed) {
      const response = await deleteAllProduct({});
      if (response.data?.success) {
        await cartRefetch();
        toast.success(response.data.message);
      }
      window.location.reload();
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    console.log("productId", productId);

    try {
      const response = await deleteProductToCartById(productId).unwrap();
      if (response.success) {
        toast.success(response.message);
        deleteCartProduct(productId);
        await cartRefetch();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Lỗi khi xóa sản phẩm.");
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    const selectedProvince = province?.find(
      (p: { codeId: string }) => p.codeId === provinceSelected,
    );
    const selectedDistrict = district?.find(
      (d: { codeId: string }) => d.codeId === districSelected,
    );
    const selectedWard = ward?.find(
      (w: { codeId: string }) => w.codeId === wardSelected,
    );

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error("Vui lòng chọn đầy đủ tỉnh, quận và phường!");
      return;
    }

    const addressString = `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}, ${address}`;
    setLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.username ?? "Unknown",
        customerEmail: user?.user.email ?? "Unknown",
        UserId: user?._id,
        address: addressString,
      };
      if (cartProducts && feeShipping > 0) {
        const checkoutUrl = await createCheckoutSession(
          feeShipping,
          cartProducts,
          metadata,
          () => deleteAllCart({}),
        );
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      }
    } catch {
      toast.error("Có lỗi xảy ra khi thanh toán bằng Stripe!");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutCash = async () => {
    const selectedProvince = province?.find(
      (p: { codeId: string }) => p.codeId === provinceSelected,
    );
    const selectedDistrict = district?.find(
      (d: { codeId: string }) => d.codeId === districSelected,
    );
    const selectedWard = ward?.find(
      (w: { codeId: string }) => w.codeId === wardSelected,
    );

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error("Vui lòng chọn đầy đủ tỉnh, quận và phường!");

      return;
    }

    const addressString = `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}, ${address}`;

    try {
      setLoading(true);
      await createOrder({
        paymentMethod: "Cash",
        statusOrder: "",
        statusPayment: "Paid",
        feeShipping: Number(feeShipping) || 0,
        address: addressString,
      });
      await deleteAllCart({}).unwrap();
      toast.success("Order created successfully , Please check your order!");
      window.location.reload();
    } catch {
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutWallet = async () => {
    try {
      setLoading(true);
      const totalPrice =
        cartProducts?.reduce((total, item) => {
          const price = item.productId.price as number;
          const quantity = item.quantity as number;
          return total + price * quantity;
        }, 0) -
        (cartProducts?.reduce((total, item) => {
          const price = item.productId.price ?? 0;
          const discount = ((item.productId.discount ?? 0) * price) / 100;
          const discountedPrice = price + discount;
          return total + discountedPrice * item.quantity;
        }, 0) -
          cartProducts?.reduce((total, item) => {
            const price = item.productId.price as number;
            const quantity = item.quantity as number;
            return total + price * quantity;
          }, 0));

      if ((wallet as any)?.wallet < totalPrice) {
        toast.error("Số dư ví không đủ để thanh toán!");
        return;
      }

      const selectedProvince = province?.find(
        (p: { codeId: string }) => p.codeId === provinceSelected,
      );
      const selectedDistrict = district?.find(
        (d: { codeId: string }) => d.codeId === districSelected,
      );
      const selectedWard = ward?.find(
        (w: { codeId: string }) => w.codeId === wardSelected,
      );

      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        toast.error("Vui lòng chọn đầy đủ tỉnh, quận và phường!");

        return;
      }

      const addressString = `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}, ${address}`;
      await payByWallet({
        items: cartProducts,
        totalPrice: totalPrice,
        feeShipping: Number(feeShipping) || 0,
        currentDiscount:
          cartProducts?.reduce((total, item) => {
            const price = item.productId.price ?? 0;
            const discount = ((item.productId.discount ?? 0) * price) / 100;
            const discountedPrice = price + discount;
            return total + discountedPrice * item.quantity;
          }, 0) -
          cartProducts?.reduce((total, item) => {
            const price = item.productId.price as number;
            const quantity = item.quantity as number;
            return total + price * quantity;
          }, 0),
        address: addressString,
      }).unwrap();

      await createOrder({
        paymentMethod: "Wallet",
        statusOrder: "",
        statusPayment: "Paid",
        feeShipping: Number(feeShipping),
        address: addressString,
      });

      await deleteAllCart({}).unwrap();
      toast.success("Thanh toán bằng ví thành công!");
      refetchWallet();
      window.location.reload();
    } catch {
      toast.error("Có lỗi xảy ra khi thanh toán bằng ví!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isClient ? (
        <Container>
          {cartProducts?.length ? (
            <>
              <div className="flex items-center gap-10 py-5 ">
                <div className=" flex justify-center items-center gap-4">
                  <ShoppingBag />
                  <h1 className="text-2xl font-semibold">Giỏ hàng</h1>
                </div>
                <div className="text-2xl font-semibold flex justify-center items-center gap-1">
                  <WalletIcon /> :{" "}
                  <PriceFormatter
                    className="text-red-500 text-2xl"
                    amount={(wallet as any)?.wallet ?? 0}
                  />
                </div>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                {/* Products */}
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md max-h-[calc(100vh-300px)] overflow-y-auto">
                    {cartProducts?.map((product, index) => {
                      return (
                        <div
                          key={product?.productId._id || `product-${index}`}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-center gap-2 h-36 md:h-44">
                            {product?.productId.picture && (
                              <Link
                                href={`/product/${product?.productId?._id}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                              >
                                <Image
                                  src={product?.productId.picture}
                                  alt="productImage"
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 overflow-hidden hoverEffect"
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 items-start flex-col justify-between py-1">
                              <div className="space-y-1.5">
                                <h2 className="font-semibold line-clamp-1">
                                  {product?.productId.name}
                                </h2>
                                <p className="text-sm text-lightColor font-medium">
                                  {product?.productId.description.length > 100
                                    ? product.productId.description.slice(
                                        0,
                                        100,
                                      ) + "..."
                                    : product?.productId.description}
                                </p>

                                <p className="text-sm capitalize">
                                  Số lượng còn lại:{" "}
                                  <span className="font-semibold">
                                    {product?.productId.stock}
                                  </span>
                                </p>
                                {/* <p className="text-sm capitalize">
                                  Mô tả: <span className="font-semibold">{product?.productId.decription}</span>
                                </p> */}
                              </div>
                              <div className="text-gray-500 flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() =>
                                          handleDeleteProduct(
                                            product?.productId._id,
                                          )
                                        }
                                        className="w-4 h-4 md:w-5 md:h-5 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Xóa sản phẩm khỏi giỏ hàng
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                              <PriceView
                                className="font-bold text-lg"
                                price={
                                  (product?.productId.price as number) *
                                  (product?.quantity as number)
                                }
                                discount={20}
                              />
                              <QuantityButtons
                                product={product?.productId}
                                cartList={cartProducts || []}
                                refetch={cartRefetch}
                                setItemCount={setItemCount}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      onClick={handleResetCart}
                      className="m-5 font-semibold"
                      variant="destructive"
                    >
                      Xóa trắng giỏ hàng
                    </Button>
                  </div>
                </div>
                {/* Address */}
                <div className="flex-col">
                  <div className="flex">
                    <SelectFiled
                      lists={province || []}
                      title="Tỉnh"
                      onSelect={(value: string) => setProvinceSelected(value)}
                    />
                    <SelectFiled
                      lists={district || []}
                      title="Huyện"
                      onSelect={(value: string) => setDistricSelected(value)}
                    />
                    <SelectFiled
                      lists={ward || []}
                      title="Đường"
                      onSelect={(value: string) => setWardSelected(value)}
                    />
                  </div>
                  <div>
                    <input
                      title="Chi tiết"
                      type="text"
                      className="w-full border p-2 mb-2"
                      placeholder="Hãy nhập địa chỉ chi tiết"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  {/* Summary */}
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">
                        Chi tiết đơn hàng
                      </h2>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Giá sản phẩm</span>
                          <PriceFormatter
                            amount={cartProducts?.reduce((total, item) => {
                              const price = item.productId.price as number;
                              const quantity = item.quantity as number;
                              return total + price * quantity;
                            }, 0)}
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>Giảm giá</span>
                          <PriceFormatter
                            amount={
                              cartProducts?.reduce((total, item) => {
                                const price = item.productId.price ?? 0;
                                const discount =
                                  ((item.productId.discount ?? 0) * price) /
                                  100;
                                const discountedPrice = price + discount;
                                return total + discountedPrice * item.quantity;
                              }, 0) -
                              cartProducts?.reduce((total, item) => {
                                const price = item.productId.price as number;
                                const quantity = item.quantity as number;
                                return total + price * quantity;
                              }, 0)
                            }
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>Phí giao hàng</span>
                          <PriceFormatter amount={feeShipping} />
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span>Tổng đơn hàng</span>
                          <PriceFormatter
                            amount={
                              cartProducts?.reduce((total, item) => {
                                const price = item.productId.price as number;
                                const quantity = item.quantity as number;
                                return total + price * quantity;
                              }, 0) -
                              (cartProducts?.reduce((total, item) => {
                                const price = item.productId.price ?? 0;
                                const discount =
                                  ((item.productId.discount ?? 0) * price) /
                                  100;
                                const discountedPrice = price + discount;
                                return total + discountedPrice * item.quantity;
                              }, 0) -
                                cartProducts?.reduce((total, item) => {
                                  const price = item.productId.price as number;
                                  const quantity = item.quantity as number;
                                  return total + price * quantity;
                                }, 0)) +
                              feeShipping
                            }
                            className="text-lg font-bold text-black"
                          />
                        </div>
                        <Button
                          disabled={
                            loading || !cartProducts?.length || !feeShipping
                          }
                          onClick={handleCheckoutWallet}
                          className="w-full rounded-full font-semibold tracking-wide bg-green-500"
                          size="lg"
                        >
                          Thanh toán bằng ví <WalletIcon />
                        </Button>
                        <Button
                          disabled={
                            loading || !cartProducts?.length || !feeShipping
                          }
                          onClick={handleCheckoutCash}
                          className="w-full rounded-full font-semibold tracking-wide bg-neutral-600"
                          size="lg"
                        >
                          Thanh toán khi nhận <DollarSign />
                        </Button>
                        <Button
                          disabled={
                            loading || !cartProducts?.length || !feeShipping
                          }
                          onClick={handleCheckout}
                          className="w-full rounded-full font-semibold tracking-wide bg-blue-500"
                          size="lg"
                        >
                          Thanh toán bằng Stripe <BanknoteIcon />
                        </Button>

                        {/* <Button
                          disabled={loading || !cartProducts?.length || !feeShipping}
                          onClick={handleCheckoutWallet}
                          className="w-full rounded-full font-semibold tracking-wide bg-blue-500"
                          size="lg"
                        >
                          Trả bằng tiền trong ví <BanknoteIcon />
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Order summary for mobile view */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="p-4 rounded-lg border mx-4">
                    <h2 className="text-xl font-semibold mb-4">
                      Chi tiêt đơn hàng
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Giá sản phẩm</span>
                        <PriceFormatter amount={getSubtotalPrice()} />
                      </div>
                      <div className="flex justify-between">
                        <span>Giảm giá</span>
                        <PriceFormatter
                          amount={getSubtotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Phí giao hàng</span>
                        <PriceFormatter amount={feeShipping} />
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Tổng đơn hàng</span>
                        <PriceFormatter
                          amount={getTotalPrice() + feeShipping}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        disabled={
                          loading || !cartProducts?.length || !feeShipping
                        }
                        onClick={handleCheckoutWallet}
                        className="w-full rounded-full font-semibold tracking-wide bg-green-500"
                        size="lg"
                      >
                        Thanh toán bằng ví <WalletIcon />
                      </Button>
                      <Button
                        disabled={
                          loading || !cartProducts?.length || !feeShipping
                        }
                        onClick={handleCheckoutCash}
                        className="w-full rounded-full font-semibold tracking-wide bg-neutral-600"
                        size="lg"
                      >
                        Thanh toán khi nhận <DollarSign />
                      </Button>
                      <Button
                        disabled={
                          loading || !cartProducts?.length || !feeShipping
                        }
                        onClick={handleCheckout}
                        className="w-full rounded-full font-semibold tracking-wide bg-blue-500"
                        size="lg"
                      >
                        Thanh toán bằng Stripe <BanknoteIcon />
                      </Button>
                      <Link
                        href={"/"}
                        className="flex items-center justify-center py-2 border border-darkColor/50 rounded-full hover:border-darkColor hover:bg-darkColor/5 hoverEffect"
                      >
                        <Image
                          src={paypalLogo}
                          alt="paypalLogo"
                          className="w-20"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccessToCart />
      )}
    </div>
  );
};

export default CartPage;
