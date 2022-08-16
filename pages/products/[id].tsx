import { GetServerSidePropsContext, NextPage } from "next";

// Lib
import { Product } from "@prisma/client";

// Services
import { getProductById } from "@services/product";

// UI Components
import { Container, SimpleGrid } from "@mantine/core";

// Components
import { Header } from "@components/Header";
import { ProductDetailsCard } from "@components/Product/ProductDetailsCard";

// Props
interface Props {
  product: Product;
}

const ProductDetails: NextPage<Props> = ({ product }) => {
  return (
    <div>
      <Header />
      <Container my="xl">
        <SimpleGrid breakpoints={[{ minWidth: "sm", cols: 2 }]} spacing="lg">
          <ProductDetailsCard product={product} />
        </SimpleGrid>
      </Container>
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // If there is no category param then return 404
  if (!context.params?.id) {
    return {
      notFound: true,
    };
  }

  // Get the product by id
  const product = await getProductById(parseInt(context.params.id as string));

  // If there is no product then return 404
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      // This is a workaround for Date objects because Next.js does not serialize them on server side for performance reasons
      product: JSON.parse(JSON.stringify(product)),
    },
  };
};

export default ProductDetails;
