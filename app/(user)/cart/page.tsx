"use client";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import Loading from "@/components/Loading";
import NoAccessToCart from "@/components/NoAccessToCart";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCartStore from "@/store";
import {
  BanknoteIcon,
  DollarSign,
  Heart,
  ShoppingBag,
  StrikethroughIcon,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import paypalLogo from "@/images/paypalLogo.png";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import { useUser } from "@/hooks/useUser";
import {
  useCreateOrderMutation,
  useDeleteAllProductToCardMutation,
  useGetCardQuery,
  useGetWalletQuery,
} from "@/state/api";
import PriceView from "@/components/PriceView";
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetShippingFeeMutation,
  useGetWardsQuery,
} from "@/state/apiGHN";
import { SelectFiled } from "@/components/SelectFiled";
import { useSocket } from "@/hooks/useWebSocket";

const CartPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubtotalPrice,
    resetCart,
    getGroupedItems,
  } = useCartStore();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setIsClient(true);
    }
  }, [user]);
  const { data: cartProducts = [], refetch: cartRefetch } = useGetCardQuery({});
  const [deleteAllCart] = useDeleteAllProductToCardMutation();
  const [itemCount, setItemCount] = useState(0);
  const [districSelected, setDistricSelected] = useState("");
  const [provinceSelected, setProvinceSelected] = useState("");
  const [wardSelected, setWardSelected] = useState("");
  const [feeShipping, setFeeShipping] = useState(0);
  const [getFeeShipping] = useGetShippingFeeMutation();
  const [createOrder] = useCreateOrderMutation();
  const { data: province } = useGetProvincesQuery({});
  const { data: district } = useGetDistrictsQuery(
    {
      provinceId: provinceSelected ? parseInt(provinceSelected) : 0,
    },
    {
      skip: !provinceSelected,
    }
  );
  const { data: ward, error: wardError } = useGetWardsQuery(
    { districtId: districSelected ? parseInt(districSelected) : 0 },
    { skip: !districSelected } // Only fetch wards if a district is selected
  );
  const { data: wallet, refetch: refetchWallet } = useGetWalletQuery({});
  const socket = useSocket();
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
  }, [socket]);
  useEffect(() => {
    const fetchFee = async () => {
      if (wardSelected && districSelected) {
        const fromDistrictId = parseInt(districSelected);
        const fromWardCode = parseInt(wardSelected);

        if (!isNaN(fromDistrictId) && !isNaN(fromWardCode)) {
          try {
            const res = await getFeeShipping({
              service_type_id: 2,
              // from_district_id: 202,
              // from_ward_code: "3695",
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
          } catch (error) {
            console.error("Failed to fetch fee:", error);
          }
        }
      }
    };

    fetchFee();
  }, [wardSelected]);


  const handleResetCart = () => {
    const confirmed = window.confirm("Are you sure to reset your Cart?");
    if (confirmed) {
      resetCart();
      toast.success("Your cart reset successfully!");
    }
  };
  const handleDeleteProduct = (id: string) => {
    deleteCartProduct(id);
    toast.success("Product deleted successfully!");
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),

        customerName: user?.username ?? "Unknown",
        customerEmail: user?.user.email ?? "Unknown",
        UserId: user?._id,
      };
      if (cartProducts && feeShipping > 0) {
        const checkoutUrl = await createCheckoutSession(
          feeShipping,
          cartProducts,
          metadata,
          () => deleteAllCart({})
        );
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutCash = async () => {
    try {
      setLoading(true);

      await createOrder({
        paymentMethod: "Cash",
        statusOrder: "",
        statusPayment: "Pending",
        feeShipping: Number(feeShipping) || 0,
      });

      await deleteAllCart({}).unwrap();
      toast.success("Order created successfully!");
      window.location.reload();

    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
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
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag />
                <h1 className="text-2xl font-semibold">Shopping Cart</h1>
                <div className="text-2xl font-semibold">
                  Wallet : <PriceFormatter amount={wallet?.amount ?? 0} />
                </div>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                {/* Products */}
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {cartProducts?.map((product, index) => {
                      // const itemCount = getItemCount(product?._id);
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
                                  {product?.productId.description}
                                </p>
                                <p className="text-sm capitalize">
                                  Variant:{" "}
                                  <span className="font-semibold">
                                    {product?.productId.stock}
                                  </span>
                                </p>
                                <p className="text-sm capitalize">
                                  Description:{" "}
                                  <span className="font-semibold">
                                    {product?.productId.decription}
                                  </span>
                                </p>
                              </div>
                              <div className="text-gray-500 flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Heart className="w-4 h-4 md:w-5 md:h-5 hover:text-green-600 hoverEffect" />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Add to Favorite
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() =>
                                          handleDeleteProduct(
                                            product?.productId._id
                                          )
                                        }
                                        className="w-4 h-4 md:w-5 md:h-5 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Delete product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                              {/* <PriceFormatter
                                amount={
                                  (product?.productId.price as number) *
                                  (product?.quantity as number)
                                }
                                className="font-bold text-lg"
                              /> */}
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
                      Reset Cart
                    </Button>
                  </div>
                </div>
                {/* Address */}
                <div className="flex-col">
                  <div className="flex">
                    <SelectFiled
                      lists={province || []}
                      title="Province"
                      onSelect={(value: string) => setProvinceSelected(value)}
                    />
                    <SelectFiled
                      lists={district || []}
                      title="District"
                      onSelect={(value: string) => setDistricSelected(value)}
                    />
                    <SelectFiled
                      lists={ward || []}
                      title="Ward"
                      onSelect={(value: string) => setWardSelected(value)}
                    />
                  </div>
                  {/* summary */}
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                      </h2>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <PriceFormatter
                            amount={cartProducts?.reduce((total, item) => {
                              const price = item.productId.price as number;
                              const quantity = item.quantity as number;
                              return total + price * quantity;
                            }, 0)}
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>Discount</span>
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
                          <span>Fee Shipping</span>

                          <PriceFormatter amount={feeShipping} />
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span>Total</span>
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
                          onClick={handleCheckoutCash}
                          className="w-full rounded-full font-semibold tracking-wide bg-neutral-600"
                          size="lg"
                        >
                          Pay With Cash <DollarSign />
                        </Button>
                        <Button
                          disabled={
                            loading || !cartProducts?.length || !feeShipping
                          }
                          onClick={handleCheckout}
                          className="w-full rounded-full font-semibold tracking-wide bg-blue-500"
                          size="lg"
                        >
                          Pay With Stripe <BanknoteIcon />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Order summary for mobile view */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="p-4 rounded-lg border mx-4">
                    <h2 className="text-xl font-semibold mb-4">
                      Order Summary
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <PriceFormatter amount={getSubtotalPrice()} />
                      </div>
                      <div className="flex justify-between">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubtotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        onClick={handleCheckout}
                        className="w-full rounded-full font-semibold tracking-wide"
                        size="lg"
                      >
                        Proceed to Checkout
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
