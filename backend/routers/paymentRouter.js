const express = require("express");
const router = express.Router();
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/payment");

const { isAuthenticateUser } = require("../middlewares/auth");

router.route("/payment/process").post(isAuthenticateUser, processPayment);

router.route("/stripeapikey").get(isAuthenticateUser, sendStripeApiKey);

module.exports = router;
