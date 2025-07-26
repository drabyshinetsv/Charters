import Stripe from "stripe";

let stripe: Stripe | null = null;

const getStripe = (): Stripe => {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    stripe = new Stripe(secretKey);
  }
  return stripe;
};

export default getStripe;
