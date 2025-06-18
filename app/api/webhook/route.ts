import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import toast from "react-hot-toast";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  // const [deleteAllCart] = useDeleteAllProductToCardMutation()
  // const [createOrder] = useCreateOrderMutation()
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      {
        error: "No Signature",
      },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

  if (!webhookSecret) {
    return NextResponse.json(
      {
        error: "Stripe webhook secret is not set",
      },
      { status: 400 },
    );
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Webhook Error: ${error}`,
      },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    await stripe.invoices.retrieve(session.invoice as string);
    // await deleteAllCart({})

    try {
    } catch (error) {
      toast.error(
        "Error creating order in sanity:",
        error || "Error creating order in sanity",
      );
      return NextResponse.json(
        {
          error: `Error creating order: ${error}`,
        },
        { status: 400 },
      );
    }
  }
  return NextResponse.json({ received: true });
}
