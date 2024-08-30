import React from "react";
import { Form } from "react-router-dom";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import "./login.scss";

interface LoginFromProps {
  isLogin: boolean;
  isRegister?: () => void;
}
export default function LoginFrom(props: LoginFromProps) {
  const { isLogin, isRegister } = props;

  function changeRegister() {
    if (isRegister) {
      isRegister();
    }
  }
  function handleRegister() {
    console.log("注册");
  }

  function handleLogin() {
    console.log("登陆");
  }

  return (
    <>
      <Form
        action="/login"
        method={isLogin ? "get" : "post"}
        className="loginFrom"
      >
        <div className="loginName">
          <h2>用户: </h2>
          <Input
            type="text"
            name="username"
          />
        </div>
        <div className="loginName">
          <h2>密码: </h2>
          <Input
            type="text"
            name="password"
          />
        </div>
        {isLogin ? (
          <>
            <Button
              onButtonClick={handleLogin}
              type="submit"
              content={"登陆"}
            />
            <Button
              type="submit"
              onButtonClick={changeRegister}
              content="注册"
            />
          </>
        ) : (
          <Button
            type="submit"
            onButtonClick={handleRegister}
            content="注册"
            buttonStyle={{ width: 200 }}
          />
        )}
      </Form>
    </>
  );
}
