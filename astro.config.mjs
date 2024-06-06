import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import db from "@astrojs/db";
import sectionize from "@hbsnow/rehype-sectionize";

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
  markdown: {
    rehypePlugins: [],
  },
  integrations: [db()],
});
