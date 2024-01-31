import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* External Script for Google Analytics */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-WLEBDLC830"
          ></script>

          {/* Google Material Icons */}
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </Head>
        <body className="your-global-class">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
  };
};
