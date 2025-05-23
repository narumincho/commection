// @ts-types="npm:@types/react"
import React from "npm:react";
// @ts-types="npm:@types/react-dom/client"
import { hydrateRoot } from "npm:react-dom/client";
import { App } from "./component/app.tsx";

const pathPrefix = document.body.dataset.pathPrefix;
if (!pathPrefix) {
  throw new Error("pathPrefix is not defined");
}

hydrateRoot(
  document,
  <App
    origin={location.origin}
    pathPrefix={pathPrefix.split("/")}
  />,
);
