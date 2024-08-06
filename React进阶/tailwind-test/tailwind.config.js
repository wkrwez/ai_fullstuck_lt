/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: ["./src/**/*.{js,jsx,ts,tsx}"], //tailwind配置文件
  theme: {
    extend: {
      padding: {
        1: "30px",
      },
      fontSize: {
        base: ["30px", "40px"],
      },
    },
  },
  plugins: [require("./myPluging.plugin")],
};
