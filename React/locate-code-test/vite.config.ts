import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { codeInspectorPlugin } from "code-inspector-plugin";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    codeInspectorPlugin({
      bundler: "vite", // 根据你的实际打包工具修改为 'webpack' 等
      editor: "trae",
    }),
  ],
});
