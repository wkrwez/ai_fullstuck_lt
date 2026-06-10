import { useState } from "react";

export default function App() {
  const [obj, setObj] = useState({
    a: 1,
  });
  setTimeout(() => {
    setObj({ a: 2 });
  }, 1000);
  return <div className="container">{obj.a}</div>;
}
