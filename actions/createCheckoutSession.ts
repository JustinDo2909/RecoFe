"use server";
import stripe from "@/lib/stripe";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import { Card } from "@/types";
import Stripe from "stripe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  UserId: string;
  address: any;
}

interface CartItems {
  products: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  feeShipping: number,
  items: Card[],
  metadata: Metadata,
  deleteAllCart: () => void
) {
  try {
    const customers = await stripe.customers.list({
      email: metadata?.customerEmail,
      limit: 1,
    });

    const customerId = customers.data.length > 0 ? customers.data[0].id : "";

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata?.orderNumber,
        customerName: metadata?.customerName,
        customerEmail: metadata?.customerEmail,
        UserId: metadata?.UserId,
        address: metadata?.address,
      },
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}&customerName=${metadata.customerName}&customerEmail=${metadata.customerEmail}&UserId=${metadata.UserId}&feeShipping=${feeShipping}&address=${encodeURIComponent(metadata.address)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      line_items: [
        ...items.map((item) => ({
          price_data: {
            currency: "VND",
            unit_amount: Math.round(item.productId.price!),
            product_data: {
              name: item.productId.name || "Unnamed Product",
              description: item.productId.description,
              metadata: { id: item.productId._id },
              images:
                item.productId.picture && item.productId.picture.length > 0
                  ? [
                      typeof item.productId.picture === "string"
                        ? item.productId.picture
                        : urlFor(item.productId.picture[0]).url(),
                    ]
                  : undefined,
            },
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: "VND",
            unit_amount: feeShipping,
            product_data: {
              name: "Phí vận chuyển",
            },
          },
          quantity: 1,
        },
      ],
    };

    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch {}
}
