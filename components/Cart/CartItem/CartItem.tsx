import React from "react";
import Image from "next/image";

// Stores
import { useCartStore, CartItem as ICartItem } from "@stores/useCartStore";

// UI Components
import { ActionIcon, Card, Group, Text } from "@mantine/core";

// Icons
import { IconTrash } from "@tabler/icons";

// Props
type CartItemProps = {
  cartItem: ICartItem;
};

export const CartItem: React.FC<CartItemProps> = ({ cartItem }) => {
  const { removeFromCart } = useCartStore();

  return (
    <Card withBorder shadow="sm">
      <Group position="apart">
        <Group>
          <div style={{ width: 100, height: 100, position: "relative" }}>
            <Image
              src={cartItem.image}
              alt={cartItem.title}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div>
            <Text weight={700} size="xl">
              {cartItem.title}
            </Text>
            <Text size="xs">by {cartItem.manufacturer}</Text>
            <Text size="xs" color="dimmed">
              Quantity: {cartItem.quantity}
            </Text>
          </div>
        </Group>
        <ActionIcon size="sm" color="red" onClick={() => removeFromCart(cartItem.id)}>
          <IconTrash />
        </ActionIcon>
      </Group>
    </Card>
  );
};
