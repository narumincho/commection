// @ts-types="npm:@types/react"
import React from "npm:react";
// @ts-types="npm:@types/react-dom/client"
import { createRoot } from "npm:react-dom/client";

/**
 * commection のエディターを動かす
 *
 * ブラウザ内で動かす必要がある
 */
export const startEditor = (): void => {
  const rootElement = document.getElementById("root");
  if (rootElement === null) {
    console.error("rootElement を見つからなかった");
    return;
  }

  createRoot(
    rootElement,
  ).render(
    <React.StrictMode>
      <div>
        APIドキュメントはSSRするのが理想だな. データはSSRしないほうが良い
      </div>
    </React.StrictMode>,
  );
};

startEditor();
