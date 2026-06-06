import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      getJSON(cssFileName, json, outputFileName) {
        console.log(cssFileName, json, outputFileName);
      },
      // generateScopedName: (name, filename, css) => {
      //   // 修改类名
      //   console.log(filename);
      //   return `${name}_${filename.split("/").pop()?.split(".")[0]}`;
      // },
      // 允许导出全局样式
      exportGlobals: true,
      // 把所有css当作全局样式，除非样式文件配置local,默认是local
      // scopeBehaviour: "global",
      // 正则匹配样式文件，设为全局
      // globalModulePaths: [/Button1/],
      // 导出样式为驼峰
      localsConvention: "camelCase",
    },
  },
});
