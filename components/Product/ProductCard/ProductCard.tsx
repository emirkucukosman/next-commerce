import React from "react";
import Image from "next/image";
import Link from "next/link";

// Lib
import { Product } from "@prisma/client";

// Stores
import { useCartStore } from "@stores/useCartStore";

// UI Components
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconShoppingCartPlus } from "@tabler/icons";

// Props
type ProductCardProps = {
  product: Product;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      quantity: 1,
      ...product,
    });
    showNotification({
      message: `${product.title} added to cart`,
      color: "green",
    });
  };

  return (
    <Card withBorder>
      <Link href={`/products/${product.id}`} passHref>
        <a>
          <div
            style={{
              width: "100%",
              height: 300,
              position: "relative",
            }}
          >
            <Image src={product.image} alt={product.title} layout="fill" objectFit="contain" />
          </div>
        </a>
      </Link>
      <Link href={`/products/${product.id}`} passHref>
        <a style={{ color: "inherit", textDecoration: "none" }}>
          <Text size="xs" weight={700}>
            {product.manufacturer}
          </Text>
          <Text title={product.title} lineClamp={1}></Text>
          {product.title}
        </a>
      </Link>
      <Group position="apart" mt="sm">
        <Text weight={700}>${product.price.toFixed(2)}</Text>
        <ActionIcon size="sm" onClick={handleAddToCart}>
          <IconShoppingCartPlus />
        </ActionIcon>
      </Group>
    </Card>
  );
};
