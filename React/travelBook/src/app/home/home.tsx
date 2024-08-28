import "./index.scss";
import React from "react";

import SelectBar from "../../components/selectBar/index.tsx";
export default function Home() {
  return (
    <div className="home">
      <SelectBar
        content="首页"
        isIcon={true}
      />
    </div>
  );
}
