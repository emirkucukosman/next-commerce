import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";

// Services
import { getByPaymentIntentId, updateIsVerified } from "@services/order";

// UI Components
import { Alert, Button, Stack } from "@mantine/core";
import { NextLink } from "@mantine/next";

// Icons
import { IconCircleCheck, IconAlertCircle } from "@tabler/icons";

// Components
import { Page } from "@components/Page";

const CheckoutComplete: NextPage = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectStatus = searchParams.get("redirect_status");
    setIsSuccess(typeof redirectStatus === "string" && redirectStatus === "succeeded");
  }, []);

  if (isSuccess === undefined) return <div>Loading...</div>;

  return (
    <Page title="Checkout Complete">
      <Alert
        icon={isSuccess ? <IconCircleCheck /> : <IconAlertCircle />}
        color={isSuccess ? "green" : "red"}
      >
        <Stack align="flex-start">
          {isSuccess ? "We've got your order!" : "We could not get your order :("}
          {isSuccess && (
            <Button
              component={NextLink}
              href="/account/my-orders"
              size="xs"
              color="lime"
              variant="outline"
            >
              Go to my orders
            </Button>
          )}
        </Stack>
      </Alert>
    </Page>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // If there is no paymen_intent param then return 404
  if (!context.query.payment_intent) {
    return {
      notFound: true,
    };
  }

  const paymentIntent = await fetch(
    `https://api.stripe.com/v1/payment_intents/${context.query.payment_intent}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    }
  );
  const paymentIntentData = await paymentIntent.json();
  if (!paymentIntentData.id) {
    return {
      notFound: true,
    };
  }

  const order = await getByPaymentIntentId(paymentIntentData.id);
  await updateIsVerified(order.id, true);

  return {
    props: {
      paymentIntentData,
    },
  };
};

export default CheckoutComplete;
