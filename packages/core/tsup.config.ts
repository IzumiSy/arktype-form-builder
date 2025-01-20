/// <reference types="node" />
import { defineConfig } from "tsup";

const devOpts =
  process.env.NODE_ENV === "development"
    ? {
        minify: false,
        sourcemap: true,
        splitting: false,
      }
    : {};

export default defineConfig({
  format: ["esm"],
  entryPoints: ["src/index.ts"],
  dts: true,
  minify: true,
  clean: true,
  external: ["react", "arktype"],
  ...devOpts,
});
