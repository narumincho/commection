import React from "https://esm.sh/react@18.2.0?pin=v124";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client?pin=v124";

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
      <div>やっぱhtmlのbodyはSSRしなくても良いや</div>
    </React.StrictMode>,
  );
};
