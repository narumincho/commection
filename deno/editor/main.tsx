// @ts-types="https://esm.sh/react@18.3.1"
import React from "npm:react";
// @ts-types="https://esm.sh/react-dom@18.3.1/client"
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
