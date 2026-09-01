import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // SPA fallback: every path serves the shell so /resume deep-links resolve.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
