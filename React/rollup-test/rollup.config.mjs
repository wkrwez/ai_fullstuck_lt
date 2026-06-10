import postcss from "rollup-plugin-postcss";
import myExtractCssRollupPlugin from "./my-extract-css-rollup-plugin.mjs";
/** @type {import("rollup").RollupOptions} */
export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/esm.js",
      format: "esm",
    },
    {
      file: "dist/cjs.js",
      format: "cjs",
    },
    {
      file: "dist/umd.js",
      name: "Guang",
      format: "umd",
    },
  ],
  treeshake: false,
  plugins: [
    myExtractCssRollupPlugin({
      filename: "index.css",
    }),
    // postcss({
    //   // extract: "index.css", // 开启css提取，提取到index.css文件
    // }),
  ],
};
