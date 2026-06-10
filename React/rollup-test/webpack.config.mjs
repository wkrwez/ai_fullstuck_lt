import path from "node:path";
// 将css从js中抽离出来，生成单独文件
import MiniCssExtractPlugin from "mini-css-extract-plugin";

/** @type {import("webpack").Configuration} */
export default {
  entry: "./src/index.js",
  mode: "development",
  devtool: false,
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(import.meta.dirname, "dist2"),
    filename: "bundle.js",
    libraryTarget: "module",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        // css-loader：将css转为js。
        // style-loader：找到head标签，写入style标签，将css内容写入style标签内
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
  ],
};
