const env = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  checkoutSuccessUrl: process.env.CHECKOUT_SUCCESS_URL || "http://localhost:3000/payment/success",
  checkoutCancelUrl: process.env.CHECKOUT_CANCEL_URL || "http://localhost:3000/payment/cancel",
  deliveryAutoCompleteMs: Number(process.env.DELIVERY_AUTO_COMPLETE_MS || 120000),
};

module.exports = env;
