import React from "react";

// UI Components
import { useMantineTheme } from "@mantine/core";

// Icons
import { IconStar } from "@tabler/icons";

// Props
type RatingProps = {
  rating: number;
};

export const Rating: React.FC<RatingProps> = ({ rating }) => {
  const theme = useMantineTheme();

  return (
    <React.Fragment>
      {Array.from(Array(rating), (_, i) => (
        <IconStar size={16} fill={theme.colors.yellow[5]} key={i} />
      ))}
      {Array.from(Array(5 - rating), (_, i) => (
        <IconStar size={16} key={i} />
      ))}
    </React.Fragment>
  );
};
