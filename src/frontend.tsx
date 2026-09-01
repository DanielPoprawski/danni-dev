/**
 * Entry point: mounts the router into #root.
 * Referenced from src/index.html.
 */
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { Layout } from "@/routes/Layout";
import { Index } from "@/routes/Index";
import { Resume } from "@/routes/Resume";
import { NotFound } from "@/routes/NotFound";

// Gates the reveal animation's initial hidden state, so entries are never
// stuck invisible if the bundle fails to execute.
document.documentElement.classList.add("js");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Index /> },
      { path: "resume", element: <Resume /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const elem = document.getElementById("root");
if (!elem) throw new Error("#root not found");

const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

if (import.meta.hot) {
  // https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
  (import.meta.hot.data.root ??= createRoot(elem)).render(app);
} else {
  createRoot(elem).render(app);
}
