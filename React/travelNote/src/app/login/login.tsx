import React, { useState } from "react";
import "./index.scss";
import LoginFrom from "@/components/login/login";
import { Header } from "@/components/header/header";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  function changeRegister() {
    setIsLogin(false);
  }
  return (
    <div className="app">
      <div className="login">
        <Header />
        <LoginFrom
          isLogin={isLogin}
          isRegister={changeRegister}
        />
      </div>
    </div>
  );
}
