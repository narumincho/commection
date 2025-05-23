// @ts-types="npm:@types/react"
import React from "npm:react";
import icon from "../../icon.generated.json" with { type: "json" };

export const App = (
  { origin, pathPrefix }: {
    readonly origin: string;
    readonly pathPrefix: ReadonlyArray<string>;
  },
) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>commection</title>
        <meta name="description" content="commection" />
        <link
          rel="icon"
          href={new URL(
            origin +
              `/${pathPrefix.join("/")}/editor-assets/icon-${icon.hash}.png`,
          ).toString()}
        />
        <meta name="twitter:card" content="summary" />
        <meta property="og:title" content="commection" />
        <meta property="og:site_name" content="commection" />
        <meta property="og:description" content="commection" />
        <meta
          property="og:image"
          content={new URL(origin + "/cover.png").toString()}
        />
      </head>
      <body data-path-prefix={pathPrefix.join("/")}>
        <noscript>
          commection では JavaScript を使用します.
          ブラウザの設定で有効にしてください.
        </noscript>
        <div id="root">
          <div>
            APIドキュメントはSSRするのが理想だな. データはSSRしないほうが良い
          </div>
        </div>
      </body>
    </html>
  );
};
