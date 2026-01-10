import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    resolve: true,
  },
  clean: true,
  outDir: "lib",
  rolldown: {
    output: {
      entryFileNames: "[name].js",
      chunkFileNames: "[name].js",
    },
  },
});
