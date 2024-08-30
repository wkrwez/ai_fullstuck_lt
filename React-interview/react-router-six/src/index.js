import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  BrowserRouter,
  Route,
  Routes,
  HashRouter,
  useLocation,
  useParams,
  useSearchParams,
  useMatch,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Project = React.lazy(() => import("./Project"));

function Bpp() {
  const location = useLocation();
  console.log(location, "Bpp");
  return <h1>bpp</h1>;
}
function User() {
  const params = useParams();
  console.log(params, "user");
  // const location = useLocation();
  // console.log(location, "user");
  const match = useMatch(`/user/${params.id}`);
  console.log("match", match);
  const [search, setSearch] = useSearchParams();
  console.log(search.get("name"));
  return (
    <>
      <h1>我是User</h1>
      <h1>{params.id}</h1>
      <button onClick={() => setSearch({ name: 123, age: 18 })}>
        修改URL参数
      </button>
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path="/"
        element={<Layout />}
      >
        <Route
          path="/app"
          element={<App />}
        />
        <Route
          path="/bpp"
          element={<Bpp />}
        />
        <Route
          path="/user/:id"
          element={<User />}
        />
        <Route
          path="/project"
          loader={async ({ params }) => {
            console.log(params);
            return await axios.get("user");
          }}
          element={<Project />}
          lazy={async () => {
            const data = await import("./Project");
            const Project = data.default;
            return {
              element: <Project />,
            };
          }}
        />
      </Route>
    </Route>
  )
);

root.render(
  // 默认前缀 basename='pc'
  <RouterProvider router={router} />
);
