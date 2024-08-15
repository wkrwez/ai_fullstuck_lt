import { Outlet, useNavigate, Link } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const age = 18;
  return (
    <>
      <h1>通用头部</h1>
      <button
        onClick={() =>
          navigate("app", {
            state: {
              name: "张三",
              age: 18,
            },
          })
        }
      >
        去到App
      </button>
      <button
        onClick={() =>
          navigate("bpp", { state: { name: "我是需要传给Bpp页面的数据" } })
        }
      >
        去到Bpp
      </button>
      <button>
        <Link
          to={`/user/${age}?name=张三`}
          state={{ id: 123232424 }}
        >
          去到user
        </Link>
      </button>
      <button onClick={() => navigate("/project")}>去到project</button>
      <Outlet />
    </>
  );
}
