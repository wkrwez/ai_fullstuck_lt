import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Layout from "./pages/Layout/Layout";
import { AuthRouter } from "@/components/AuthRouter"; //路由守卫组件

// const App = () => {
//   const [count, setCount] = useState(0);
//   console.log("app");
//   //   const obj = {
//   //     name: "this is app name",
//   //   };
//   const [obj, setObj] = useState({ name: "this is app name" });
//   //   useEffect(() => {
//   //     console.log("app");
//   //     // setObj({ name: "this is app name" });
//   //   }, [obj]);
//   return (
//     <button
//       className="app"
//       onClick={() => setObj(obj)}
//     >
//       {count}
//     </button>
//   );
//   //   return (
//   //     <BrowserRouter>
//   //       <div className="app">
//   //         <Routes>
//   //           <Route
//   //             path="/"
//   //             element={
//   //               <AuthRouter>
//   //                 <Layout />
//   //               </AuthRouter>
//   //             }
//   //           ></Route>
//   //           <Route
//   //             path="/login"
//   //             element={<Login />}
//   //           ></Route>
//   //         </Routes>
//   //       </div>
//   //     </BrowserRouter>
//   //   );
// };

const App = () => {
  const [value, setValue] = useState("");
  console.log("app");

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  //   useEffect(() => {
  //     console.log(value);
  //   }, [value]);
  return (
    <input
      type="text"
      onChange={handleChange}
    />
  );
};

export default App;
