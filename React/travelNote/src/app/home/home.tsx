import "./index.scss";
import React from "react";

import SelectBar from "@/components/selectBar/index";
export default function Home() {
  return (
    <div className="home">
      <SelectBar
        content="首页"
        isIcon={true}
        barClassName="bottom"
      />
    </div>
  );
}
