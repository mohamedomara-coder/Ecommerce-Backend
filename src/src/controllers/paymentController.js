const express = require("express");
const paymentService = require("../services/paymentService");

async function createPayment(req, res, next) {
  try {
    const payment = await paymentService.createCheckoutSession(req.user, req.body);
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
}

function webhook(req, res, next) {
  try {
    const signature = req.headers["stripe-signature"];
    const result = paymentService.processWebhook(signature, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

const stripeWebhookRawParser = express.raw({ type: "application/json" });

module.exports = { createPayment, webhook, stripeWebhookRawParser };
