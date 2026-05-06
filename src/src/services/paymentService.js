const Stripe = require("stripe");
const env = require("../config/env");
const HttpError = require("../utils/httpError");
const { findOrderById, updateOrder, findOrderByStripeSessionId } = require("../models/orderModel");

const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

function ensureStripeEnabled() {
  if (!stripe) {
    throw new HttpError(
      500,
      "Stripe is not configured. Set STRIPE_SECRET_KEY in environment variables.",
    );
  }
}

async function createCheckoutSession(user, { orderId }) {
  ensureStripeEnabled();
  if (!orderId) throw new HttpError(400, "orderId is required");
  const order = findOrderById(orderId);
  if (!order) throw new HttpError(404, "Order not found");
  if (order.userId !== user.id) throw new HttpError(403, "Only order owner can pay");
  if (order.status !== "pending_payment") {
    throw new HttpError(400, "Payment can only be created for pending_payment orders");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${env.checkoutSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: env.checkoutCancelUrl,
    metadata: { orderId: order.id, userId: user.id },
    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(Number(item.unitPrice) * 100),
        product_data: {
          name: item.name,
        },
      },
    })),
  });

  updateOrder(order.id, {
    payment: {
      ...order.payment,
      status: "session_created",
      provider: "stripe",
      stripeSessionId: session.id,
      checkoutUrl: session.url,
    },
  });

  return {
    orderId: order.id,
    stripeSessionId: session.id,
    checkoutUrl: session.url,
    paymentStatus: "session_created",
  };
}

function processWebhook(signature, rawBodyBuffer) {
  ensureStripeEnabled();
  if (!env.stripeWebhookSecret) throw new HttpError(500, "STRIPE_WEBHOOK_SECRET is not configured");

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBodyBuffer, signature, env.stripeWebhookSecret);
  } catch (error) {
    throw new HttpError(400, `Webhook signature verification failed: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const order = findOrderByStripeSessionId(session.id);
    if (!order) return { received: true, ignored: "order_not_found" };

    const estimatedDeliveredAt = new Date(Date.now() + env.deliveryAutoCompleteMs).toISOString();
    updateOrder(order.id, {
      status: "processing",
      payment: {
        ...order.payment,
        status: "paid",
        stripePaymentIntentId: session.payment_intent,
        paidAt: new Date().toISOString(),
      },
      delivery: {
        estimatedDeliveredAt,
      },
    });
  }

  return { received: true };
}

module.exports = { createCheckoutSession, processWebhook };
