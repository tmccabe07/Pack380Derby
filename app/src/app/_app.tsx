// pages/_app.tsx
import "@/styles/globals.css"; // your Tailwind and global CSS
import type { AppProps } from "next/app";
import type { NextPage } from "next";

// Type for pages that optionally define a `getLayout`
type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
