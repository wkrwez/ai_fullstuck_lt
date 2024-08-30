import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/index.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// 创建路由器
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

// 获取根元素并渲染应用
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("没有找到页面");
const root = createRoot(rootElement);
root.render(<RouterProvider router={router} />);
