import path from "path";
import { defineConfig } from "vite";

const port = Number(process.env.PORT || 5173);
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [],g
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        heritage: path.resolve(import.meta.dirname, "heritage.html"),
        collection: path.resolve(import.meta.dirname, "collection.html"),
        product: path.resolve(import.meta.dirname, "product.html"),
        bespoke: path.resolve(import.meta.dirname, "bespoke.html"),
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});