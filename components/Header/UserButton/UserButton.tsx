import React from "react";

// UI Components
import { createStyles, Group, Text, Menu, UnstyledButton, Avatar } from "@mantine/core";
import { NextLink } from "@mantine/next";

// Icons
import { IconChevronDown, IconTruckDelivery, IconLogout } from "@tabler/icons";
import { Session } from "next-auth";

// Styles
const useStyles = createStyles((theme) => ({
  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `4px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  userActive: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
  username: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

// Props
type UserButtonProps = {
  session: Session;
};

export const UserButton: React.FC<UserButtonProps> = ({ session }) => {
  const { classes, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = React.useState(false);

  return (
    <Menu
      width={260}
      position="bottom-end"
      transition="pop-top-right"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
    >
      <Menu.Target>
        <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
          <Group spacing={7}>
            <Avatar
              src={session.user?.image}
              alt={session.user?.name || "user avatar"}
              radius="xl"
              size={20}
            />
            <Text
              weight={500}
              size="sm"
              sx={{ lineHeight: 1 }}
              className={classes.username}
              mr={3}
            >
              {session.user?.name}
            </Text>
            <IconChevronDown size={12} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={NextLink}
          href="/account/my-orders"
          icon={<IconTruckDelivery size={14} stroke={1.5} />}
        >
          My orders
        </Menu.Item>
        <Menu.Item
          component={NextLink}
          href="/api/auth/signout"
          passHref
          icon={<IconLogout size={14} stroke={1.5} />}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
