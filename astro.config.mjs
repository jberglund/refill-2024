import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  experimental: {
    actions: true,
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [db()],
});
