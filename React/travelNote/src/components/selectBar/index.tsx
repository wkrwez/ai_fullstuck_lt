import Icon from "../icon/icon";
import React from "react";
import "./index.scss";
//icon与文字的相对位置
type BarClassNameProps = "left" | "right" | "top" | "bottom";
interface SelectBarProps {
  content: string;
  isIcon: boolean;
  iconSize?: number;
  barClassName?: BarClassNameProps;
  selectStyles?: React.CSSProperties;
}

export default function SelectBar(props: SelectBarProps) {
  const {
    content,
    isIcon,
    barClassName = "left",
    selectStyles,
    iconSize,
  } = props;
  return (
    <div
      className={barClassName}
      style={selectStyles}
    >
      {isIcon && (
        <Icon
          icon={"111"}
          size={iconSize}
        />
      )}
      <div className="content">{content}</div>
    </div>
  );
}
