import React from "react";
import { iconObj } from "./picture";

export type IconTypes = keyof typeof iconObj;

interface IconProps {
  size?: number;
  iconStyles?: React.CSSProperties;
  icon: IconTypes;
  onClick?: () => void;
}

export default function Icon(props: IconProps) {
  const { size = 200, iconStyles, icon, onClick } = props;

  function handleClick() {
    if (onClick) {
      onClick();
    }
  }
  return (
    <img
      src={iconObj[icon]}
      width={size}
      height={size}
      style={iconStyles}
      onClick={handleClick}
    />
  );
}
