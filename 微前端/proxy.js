function createProxy() {
  // 沙箱内部的全局对象
  const sandboxGlobal = Object.create(null);

  // 创建Proxy代理
  const sandboxProxy = new Proxy(sandboxGlobal, {
    get(target, prop, receiver) {
      // 只允许访问安全的全局对象
      const safeGlobals = ["Date", "JSON", "parseInt", "parseFloat"];

      if (safeGlobals.includes(prop)) {
        return globalThis[prop];
      }

      if (prop in target) {
        return target[prop];
      }

      throw new Error(`Access to ${prop} is not allowed in sandbox!`);
    },

    set(target, prop, value, receiver) {
      // 只允许修改沙箱内部的全局对象
      target[prop] = value;
      return true;
    },
  });

  return sandboxProxy;
}
const sandbox = createProxy();
sandbox.eval = (code) => {
  // 1. 定义允许的安全全局对象（白名单）
  const safeGlobals = {
    Math: Math,
    Date: Date,
    JSON: JSON,
    parseInt: parseInt,
    console: console,
  };

  // 2. 使用 with 语句将沙箱代理推入作用域链顶端
  // 这样代码里的 Math 会优先从 sandboxProxy (即 safeGlobals) 中查找
  const fn = new Function("sandbox", `with(sandbox) {  ${code} }`);

  // 3. 传入包含安全对象的普通对象
  return fn(safeGlobals);
};
// sandbox.eval("const result = Math.add(2, 3); console.log(result);");
sandbox.eval("const result = Math.floor(10); console.log(result);");
