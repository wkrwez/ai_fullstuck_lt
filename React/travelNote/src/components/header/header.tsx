import React from "react";
import "./index.scss";
import Avterdefault from "@/Assest/avter.png";

interface HeaderProps {
  size?: number;
}
export function Header(props: HeaderProps) {
  const { size = 100 } = props;
  return (
    <div className="header">
      <img
        width={size}
        height={size}
        src={Avterdefault}
        className="avter"
      />
    </div>
  );
}
