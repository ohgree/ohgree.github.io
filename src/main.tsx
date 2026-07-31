import { domAnimation, LazyMotion } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/App";

import "@/styles.css";

const rootElement = document.querySelector("#root");

if (!rootElement) {
  throw new Error("Missing #root element");
}

createRoot(rootElement).render(
  <StrictMode>
    {/* `m` components are the small build and carry no features of their own, so the DOM
        animation feature set has to be supplied here or their styles never bind. */}
    <LazyMotion features={domAnimation}>
      <App />
    </LazyMotion>
  </StrictMode>,
);
