import React from "react";
import Image from "next/image";

// Services
import { OrderWithProducts } from "@services/order";

// UI Components
import { Card, Group, Text } from "@mantine/core";

// Props
type MyOrderProductCardProps = {
  order: OrderWithProducts;
};

export const MyOrderProductCard: React.FC<MyOrderProductCardProps> = ({ order }) => {
  return (
    <Card withBorder>
      <Group position="apart">
        <Text size="xl" weight={600}>
          Order #{order.id}
        </Text>
        <Text>
          $
          {order.products
            .reduce((acc, { product, quantity }) => acc + product.price * quantity, 0)
            .toFixed(2)}
        </Text>
      </Group>
      {order.products.map(({ product, quantity }, j) => (
        <Group mt="md" key={j}>
          <Image src={product.image} alt={product.title} width={60} height={60} />
          <div>
            <Text size="sm">{product.title}</Text>
            <Text mt={-4} size="xs" color="dimmed">
              {product.manufacturer}
            </Text>
            <Text size="xs" mt={0}>
              Quantity: {quantity}
            </Text>
          </div>
        </Group>
      ))}
    </Card>
  );
};
