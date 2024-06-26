import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51MjFDXE3V7A3gKYDYfZJtkn1IiopwYaWegOpmwQRcvKmgRrbL48WrEuHEHVnzvVl59CLE3AqA7WVFhdz8mwQuhL800VtOx3JRN",
  {
    apiVersion: "2020-08-27",
  }
);

export const createPrice = async (amount, title) => {
  const price = await stripe.prices.create({
    currency: "usd",
    product_data: {
      name: title,
    },
    unit_amount: amount,
  });
  return price.id;
};

export const createCheckoutSession = async (priceId, successUrl, cancelUrl) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  return session.url;
};
