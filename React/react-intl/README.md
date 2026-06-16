# 批量生成资源包

```jsx
const messsages = defineMessages({
  username: {
    id: "username",
    defaultMessage: "用户名",
  },
  password: {
    id: "password",
    defaultMessage: "密码",
  },
  rememberMe: {
    id: "rememberMe",
    defaultMessage: "记住我",
  },
  submit: {
    id: "submit",
    defaultMessage: "提交",
  },
  inputYourUsername: {
    id: "inputYourUsername",
    defaultMessage: "请输入用户名！",
  },
  inputYourPassword: {
    id: "inputYourPassword",
    defaultMessage: "请输入密码！",
  },
});
```

```js
npm i -save-dev @formatjs/cli
// 从 ts、vue 等文件里提所有 defineMessage 定义的消息
npx formatjs extract "src/\*_/_.tsx" --out-file temp.json
npx formatjs compile 'temp.json' --out-file src/ja-JP.json
rm ./temp.json
```
