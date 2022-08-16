import React from "react";

// UI Components
import { ActionIcon, Group, NumberInput, NumberInputHandlers } from "@mantine/core";

// Props
type QuantityInputProps = {
  quantity: number;
  onChange: (quantity: number) => void;
};

export const QuantityInput: React.FC<QuantityInputProps> = ({ quantity, onChange }) => {
  const handlers = React.useRef<NumberInputHandlers>();

  return (
    <Group spacing={5}>
      <ActionIcon size={36} variant="default" onClick={() => handlers.current?.decrement()}>
        -
      </ActionIcon>

      <NumberInput
        hideControls
        value={quantity}
        onChange={onChange}
        handlersRef={handlers}
        max={10}
        min={1}
        step={1}
        styles={{ input: { width: 54, textAlign: "center" } }}
      />

      <ActionIcon size={36} variant="default" onClick={() => handlers.current?.increment()}>
        +
      </ActionIcon>
    </Group>
  );
};
