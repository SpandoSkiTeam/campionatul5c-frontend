import type { AppProps } from "next/app";
import "../app/globals.css";
import Head from "next/head";
import { SnackbarProvider } from "@/components/Snackbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script
          id="google-analytics-script"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WLEBDLC830', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>
      <SnackbarProvider />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
