import { NextPage } from "next";
import React from "react";

// Auth
import { useSession } from "next-auth/react";

// Stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Stores
import { useCartStore } from "@stores/useCartStore";

// UI Components
import { Alert, Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconInfoCircle, IconShoppingCart } from "@tabler/icons";

// Components
import { Header } from "@components/Header";
import { CartItem } from "@components/Cart/CartItem";
import { CheckoutForm } from "@components/Cart/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Cart: NextPage = () => {
  const [clientSecret, setClientSecret] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Auth
  const { data: session } = useSession();

  // Storage
  const { cart } = useCartStore();

  const handleCheckout = async () => {
    if (!session) {
      return showNotification({
        message: "Please sign in to place an order.",
        color: "red",
      });
    }

    setIsLoading(true);

    try {
      const paymentIntent = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            total: item.price * item.quantity,
            ...item,
          })),
        }),
      });
      const { clientSecret } = await paymentIntent.json();
      setClientSecret(clientSecret);
    } catch (error: any) {
      showNotification({
        message: error.message || "Something went wrong.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Container my="lg">
        <Title mb="md">Cart</Title>
        {cart.length > 0 ? (
          <Stack spacing="lg">
            {cart.map((cartItem, i) => (
              <CartItem cartItem={cartItem} key={i} />
            ))}
          </Stack>
        ) : (
          <Alert color="cyan" icon={<IconInfoCircle />}>
            Cart is empty
          </Alert>
        )}
        {cart.length > 0 && (
          <Stack mb="lg" align="flex-end">
            <Group mt="xl" position="right">
              <Text size="xl">
                Total:{" "}
                <strong>
                  $
                  {cart
                    .reduce((acc, cartItem) => acc + cartItem.price * cartItem.quantity, 0)
                    .toFixed(2)}
                </strong>
              </Text>
            </Group>
            {!clientSecret && (
              <Button
                variant="gradient"
                leftIcon={<IconShoppingCart size={18} />}
                loading={isLoading}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            )}
          </Stack>
        )}
        {clientSecret && (
          <Elements
            options={{
              appearance: {
                theme: "stripe",
              },
              clientSecret,
            }}
            stripe={stripePromise}
          >
            <CheckoutForm />
          </Elements>
        )}
      </Container>
    </div>
  );
};

export default Cart;
