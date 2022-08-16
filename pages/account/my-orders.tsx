import { GetServerSidePropsContext, NextPage } from "next";

// Services
import { getByUserId, OrderWithProducts } from "@services/order";
import { getBySessionToken } from "@services/session";

// UI Components
import { Stack } from "@mantine/core";

// Components
import { Page } from "@components/Page";
import { MyOrderProductCard } from "@components/Product/MyOrderProductCard";

// Props
type MyOrdersProps = {
  orders: OrderWithProducts[];
};

const MyOrders: NextPage<MyOrdersProps> = ({ orders }) => {
  return (
    <Page title="My Orders">
      <Stack>
        {orders.map((order, i) => (
          <MyOrderProductCard order={order} key={i} />
        ))}
      </Stack>
    </Page>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // Determine cookie name
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

  // Check if session token cookie is set
  const sessionToken = context.req.cookies[cookieName];
  if (!sessionToken) {
    return {
      props: {
        orders: [],
      },
    };
  }

  // Check if there is a session in the database
  const session = await getBySessionToken(sessionToken);
  if (!session) {
    return {
      props: {
        orders: [],
      },
    };
  }

  const orders = await getByUserId(session.userId);

  return {
    props: {
      // This is a workaround for Date objects because Next.js does not serialize them on server side for performance reasons
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
};

export default MyOrders;
