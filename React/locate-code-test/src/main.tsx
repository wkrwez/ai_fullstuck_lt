import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.tsx";
import { ClickToComponent } from "click-to-react-component"; // 对react不支持
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <>
    <ClickToComponent />
    <App />
  </>,

  /* </StrictMode>, */
);
