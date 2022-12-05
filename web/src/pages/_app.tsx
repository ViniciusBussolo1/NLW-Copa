import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "../styles/global.css";

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
