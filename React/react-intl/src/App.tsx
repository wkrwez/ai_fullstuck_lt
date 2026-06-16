import React, { useEffect } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import {
  useIntl,
  defineMessages,
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
} from "react-intl";
import getMessage from "./getMessage";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const messsages = defineMessages({
  username: {
    id: "username",
    defaultMessage: "用户名",
    description: "这是登录的用户名",
  },
  password: {
    id: "password",
    defaultMessage: "密码",
    description: "这是登录的密码",
  },
  rememberMe: {
    id: "rememberMe",
    defaultMessage: "记住我",
    description: "登录页的记住我复选框",
  },
  submit: {
    id: "submit",
    defaultMessage: "提交",
    description: "登录页的提交按钮",
  },
  inputYourUsername: {
    id: "inputYourUsername",
    defaultMessage: "请输入用户名！",
    description: "登录页的用户名为空的提示",
  },
  inputYourPassword: {
    id: "inputYourPassword",
    defaultMessage: "请输入密码！",
    description: "登录页的密码为空的提示",
  },
});

const App: React.FC = () => {
  const intl = useIntl();
  useEffect(() => {
    setTimeout(() => {
      alert(getMessage());
    }, 2000);
  }, []);

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label={intl.formatMessage(messsages.username)}
        name="username"
        rules={[
          {
            required: true,
            message: intl.formatMessage(messsages.inputYourUsername),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label={intl.formatMessage(messsages.password)}
        name="password"
        rules={[
          {
            required: true,
            message: intl.formatMessage(messsages.inputYourPassword),
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>{intl.formatMessage(messsages.rememberMe)}</Checkbox>
      </Form.Item>
      {/* 方法版本 */}
      <div>
        日期：
        <div>{intl.formatDate(new Date(), { weekday: "long" })}</div>
        <div>{intl.formatDate(new Date(), { weekday: "short" })}</div>
        <div>{intl.formatDate(new Date(), { weekday: "narrow" })}</div>
        <div>{intl.formatDate(new Date(), { dateStyle: "full" })}</div>
        <div>{intl.formatDate(new Date(), { dateStyle: "long" })}</div>
      </div>
      <div>
        相对时间：
        <div>{intl.formatRelativeTime(200, "hour")}</div>
        <div>{intl.formatRelativeTime(-10, "minute")}</div>
      </div>
      <div>
        数字：
        <div>
          {intl.formatNumber(200000, {
            style: "currency",
            currency: intl.locale.includes("en") ? "USD" : "CNY",
          })}
        </div>
        <div>
          {intl.formatNumber(10000, {
            style: "unit",
            unit: "meter",
          })}
        </div>
      </div>
      {/* 组件版本 */}
      <div>
        <div>
          <FormattedDate
            value={new Date()}
            dateStyle="full"
          ></FormattedDate>
        </div>
        <div>
          <FormattedMessage id={messsages.rememberMe.id}></FormattedMessage>
        </div>
        <div>
          <FormattedNumber
            style="unit"
            unit="meter"
            value={2000}
          ></FormattedNumber>
        </div>
      </div>
      <div>
        <div>{intl.formatMessage(messsages.username, { name: "光" })}</div>
        <div>
          <FormattedMessage
            id={messsages.username.id}
            values={{ name: "东" }}
          ></FormattedMessage>
        </div>
      </div>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type="primary"
          htmlType="submit"
        >
          {intl.formatMessage(messsages.submit)}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
