import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";

// Lib
import { Product } from "@prisma/client";

// Services
import { getProductsByCategory } from "@services/product";

// Components
import { Page } from "@components/Page";
import { ListProducts } from "@components/Product/ListProducts";

// Props
type CollectionsProps = {
  products: Product[];
  totalPage: number;
};

const Collections: NextPage<CollectionsProps> = ({ products, totalPage }) => {
  const router = useRouter();

  const getCategoryTitle = () => {
    const category = (router.query.category as string).replaceAll("-", " ");
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (products.length === 0) {
    return <Page title="No products found" />;
  }

  return (
    <Page title={getCategoryTitle()}>
      <ListProducts products={products} totalPage={totalPage} />
    </Page>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // If there is no category param then return 404
  if (!context.params?.category) {
    return {
      notFound: true,
    };
  }

  // Get pagination params
  const { page } = context.query;

  // Get products by category
  const { products, totalPage } = await getProductsByCategory(
    context.params.category as string,
    page ? parseInt(page as string) : 1
  );

  // If there are no products then return 404
  if (products.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      // This is a workaround for Date objects because Next.js does not serialize them on server side for performance reasons
      products: JSON.parse(JSON.stringify(products)),
      totalPage,
    },
  };
};

export default Collections;
