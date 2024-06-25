import express from "express";
import AuthModel from "../models/Auth.js";
import { stripe } from "../utils/stripe.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//Check if Auth is authenticated
router.get("/prices", async (req, res) => {

  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_KEY,
  });

  return res.status(200).json(prices);
});

router.post("/session", async (req, res) => {
  const { price, email } = req.body;
  const Auth = await AuthModel.findOne({ email: email });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: price,
        quantity: 1,
      }
    ],
    success_url: `${process.env.CLIENT_URL}/?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/?canceled=true`,
    customer: Auth.stripeCustomerId,
  }, {
    apiKey: process.env.STRIPE_KEY
  });

  return res.status(200).json(session);
});


//----------------------------------------------

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret = "whsec_9c1e7df8fe05d4dfa5ee800e4fde00e46355c04b164338d2a8811bd8deb224bb";
// endpointSecret = "whsec_9c1e7df8fe05d4dfa5ee800e4fde00e46355c04b164338d2a8811bd8deb224bb";

router.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {

  console.log("Webhook received!");

  const sig = request.headers['stripe-signature'];
  let data;
  let eventType;

  //(Remove this if statement if you are not using the Stripe CLI)
  if (!endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("Webhook received in event!");
    } catch (err) {
      console.log("Webhook error!", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  }

  else {
    data = request.body.data.object;
    eventType = request.body.type;
  }

  console.log("Webhook received in else!");
  if (eventType === 'checkout.session.completed') {
    console.log('Payment was successful!');
    console.log(data);
    const Auth = await AuthModel.findOne({ stripeCustomerId: data.customer });
    if (data.amount_total === 3600) {
      //Adding 100 credits to the Auth
      Auth.credits = 5500;
      Auth.plan = "basic";
      Auth.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      Auth.subscriptionId = data.subscription;
    } else if (data.amount_total === 4700) {
      //Adding 200 credits to the Auth
      Auth.credits = 7500;
      Auth.plan = "premium";
      Auth.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      Auth.subscriptionId = data.subscription;
    }
    console.log(Auth);
    await Auth.save();
  }
  response.send().end();
});

export default router;