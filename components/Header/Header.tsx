// Routing
import { useRouter } from "next/router";

// Auth
import { useSession } from "next-auth/react";

// Stores
import { useCartStore } from "@stores/useCartStore";

// UI Components
import {
  createStyles,
  Container,
  Group,
  Text,
  Tabs,
  Button,
  Badge,
  MediaQuery,
} from "@mantine/core";
import { NextLink } from "@mantine/next";

// Icons
import { IconShoppingCart, IconUserCircle } from "@tabler/icons";

// Components
import { UserButton } from "./UserButton";
import Link from "next/link";

// Styles
const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]
    }`,
    marginBottom: 16,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
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

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
    },

    "&[data-active]": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2],
    },
  },
}));

export const Header = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const { cart } = useCartStore();
  const { data: session, status: sessionStatus } = useSession();

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Link href="/" passHref>
            <a style={{ textDecoration: "none", color: "inherit" }}>
              <Group spacing={4}>
                <IconShoppingCart size={22} />
                <Text weight={700}>NextCommerce</Text>
              </Group>
            </a>
          </Link>

          {sessionStatus !== "loading" && (
            <Group spacing="xs">
              {session ? (
                <UserButton session={session} />
              ) : (
                <Button
                  component={NextLink}
                  href="/api/auth/signin"
                  variant="subtle"
                  leftIcon={<IconUserCircle size={16} />}
                  size="xs"
                  color="dark"
                  p={4}
                >
                  Sign in
                </Button>
              )}
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Button
                  component={NextLink}
                  href="/cart"
                  variant="subtle"
                  leftIcon={<IconShoppingCart size={16} />}
                  rightIcon={cart.length === 0 ? null : <Badge>{cart.length}</Badge>}
                  styles={{
                    leftIcon: {
                      marginRight: 4,
                    },
                  }}
                  size="xs"
                  color="dark"
                >
                  Cart
                </Button>
              </MediaQuery>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Button
                  component={NextLink}
                  href="/cart"
                  variant="subtle"
                  leftIcon={<IconShoppingCart size={16} />}
                  rightIcon={cart.length === 0 ? null : <Badge>{cart.length}</Badge>}
                  styles={{
                    rightIcon: {
                      marginLeft: 0,
                    },
                  }}
                  size="xs"
                  color="dark"
                />
              </MediaQuery>
            </Group>
          )}
        </Group>
      </Container>
      <Container>
        <Tabs
          value={router.asPath === "/" ? "popular" : (router.query.category as string)}
          onTabChange={(category) => {
            if (category === "popular") {
              return router.push("/");
            }
            router.push(`/collections/${category}`);
          }}
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="popular">Popular</Tabs.Tab>
            <Tabs.Tab value="clothing">Clothing</Tabs.Tab>
            <Tabs.Tab value="home-and-furniture">Home & Furniture</Tabs.Tab>
            <Tabs.Tab value="supermarket">Supermarket</Tabs.Tab>
            <Tabs.Tab value="cosmetic">Cosmetic</Tabs.Tab>
            <Tabs.Tab value="shoe">Shoe</Tabs.Tab>
            <Tabs.Tab value="accessory">Accessory</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
};
