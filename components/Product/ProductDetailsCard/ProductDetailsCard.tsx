import React from "react";
import Image from "next/image";

// Lib
import { Product } from "@prisma/client";

// Stores
import { useCartStore } from "@stores/useCartStore";

// UI Components
import { Button, Group, Paper, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconShoppingCartPlus } from "@tabler/icons";

// Components
import { Rating } from "./Rating";
import { QuantityInput } from "./QuantityInput";

// Props
type ProductDetailsCardProps = {
  product: Product;
};

export const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({ product }) => {
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      quantity,
      ...product,
    });
    showNotification({
      message: `${product.title} added to cart`,
      color: "green",
    });
  };

  return (
    <React.Fragment>
      {/* Product image */}
      <Paper
        style={{
          width: "100%",
          height: 500,
          position: "relative",
        }}
        withBorder
        p="lg"
        shadow="lg"
      >
        <Image src={product.image} alt={product.title} layout="fill" objectFit="contain" />
      </Paper>

      {/* Product details */}
      <div>
        {/* Product title and manufacturer */}
        <Title>{product.title}</Title>
        <Text size="xs">by {product.manufacturer}</Text>

        {/* Product rating */}
        <Rating rating={product.rating} />

        {/* Product pricing */}
        <Text size="xl" weight={700}>
          ${Number(product.price).toFixed(2)}
        </Text>

        {/* Product description */}
        <Text mt="lg">{product.description}</Text>

        {/* Add to cart button with quantity input */}
        <Group mt="lg" style={{ width: "100%" }}>
          <QuantityInput quantity={quantity} onChange={setQuantity} />
          <Button
            style={{ flex: 1 }}
            leftIcon={<IconShoppingCartPlus size={18} />}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Group>
      </div>
    </React.Fragment>
  );
};
