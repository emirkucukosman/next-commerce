import React from "react";
import { useRouter } from "next/router";

// Lib
import { Product } from "@prisma/client";

// UI Components
import { Group, SimpleGrid } from "@mantine/core";

// Components
import { ProductCard } from "@components/Product/ProductCard";
import { Pagination } from "@components/Pagination";

// Props
type ListProductsProps = {
  products: Product[];
  totalPage: number;
};

export const ListProducts: React.FC<ListProductsProps> = ({ products, totalPage }) => {
  const router = useRouter();

  const onPageChange = (page: number) => {
    router.replace({
      query: { ...router.query, page },
    });
  };

  return (
    <React.Fragment>
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 2 },
          { minWidth: "md", cols: 3 },
          { minWidth: "lg", cols: 4 },
        ]}
      >
        {products.map((product, i) => (
          <ProductCard product={product} key={i} />
        ))}
      </SimpleGrid>
      <Group position="center" mt="lg">
        <Pagination
          totalPage={totalPage}
          currentPage={parseInt(router.query.page as string) || 1}
          onPageChange={onPageChange}
        />
      </Group>
    </React.Fragment>
  );
};
