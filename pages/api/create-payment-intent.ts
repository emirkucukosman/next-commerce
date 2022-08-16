import { NextApiRequest, NextApiResponse } from "next";

// Lib
import { prisma } from "@lib/prisma";

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { items } = req.body;

  // Determine cookie name
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

  // Check if session token cookie is set
  const sessionToken = req.cookies[cookieName];
  if (!sessionToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if there is a session in the database
  const session = await prisma.session.findFirst({
    where: {
      sessionToken,
    },
  });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(items.reduce((acc: any, item: any) => acc + item.total, 0)) * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  // Create a new order in the database
  await prisma.order.create({
    data: {
      paymentIntentId: paymentIntent.id,
      userId: session.userId,
      products: {
        create: items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      },
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}
