import React from "react";

// Stripe
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// UI Components
import { Alert, Button, Group } from "@mantine/core";

// Icons
import { IconInfoCircle } from "@tabler/icons";
import Image from "next/image";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: process.env.NEXT_PUBLIC_STRIPE_RETURN_URL!,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <Group align="center" position="apart" mt="md">
        <Image src="/powered-by-stripe.svg" alt="Powered by Stripe" width={100} height={50} />
        <Button disabled={isLoading || !stripe || !elements} id="submit" type="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </Button>
      </Group>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
      <Alert mt="md" color="cyan" icon={<IconInfoCircle />}>
        For testing purposes, you can use the following card:
        <br />
        <strong>4242 4242 4242 4242 - Exp: 01/28 - CVV: 424</strong>
      </Alert>
    </form>
  );
};
