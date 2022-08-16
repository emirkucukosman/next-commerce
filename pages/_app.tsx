import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";

// UI Components
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

// Auth
import { SessionProvider } from "next-auth/react";

const progress = new ProgressBar({
  size: 4,
  color: "#000000",
  className: "bar-of-progress",
  delay: 100,
});

// Router events
Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

export default function App(props: AppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <>
      <Head>
        <title>NextCommerce</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "light",
          }}
        >
          <NotificationsProvider position="top-center">
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
