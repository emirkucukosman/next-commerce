import type { GetServerSidePropsContext, NextPage } from "next";

// Lib
import { Product } from "@prisma/client";

// Services
import { getPopularProducts } from "@services/product";

// Components
import { Page } from "@components/Page";
import { ListProducts } from "@components/Product/ListProducts";

// Props
type HomeProps = {
  products: Product[];
  totalPage: number;
};

const Home: NextPage<HomeProps> = ({ products, totalPage }) => {
  return (
    <Page title="Popular Products">
      <ListProducts products={products} totalPage={totalPage} />
    </Page>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // Get pagination params
  const { page } = context.query;

  // Get products by category
  const { products, totalPage } = await getPopularProducts(
    page ? parseInt(page as string) : 1
  );

  return {
    props: {
      // This is a workaround for Date objects because Next.js does not serialize them on server side for performance reasons
      products: JSON.parse(JSON.stringify(products)),
      totalPage,
    },
  };
};

export default Home;
