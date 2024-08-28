import Icon from "../icon/icon";
import React from "react";
import "./index.scss";

interface selectBarProps {
  content: string;
  isIcon: boolean;
  barClassName?: string;
  selectStyles?: React.CSSProperties;
}

export default function SelectBar(props: selectBarProps) {
  const { content, isIcon, barClassName = "left", selectStyles } = props;
  return (
    <div
      className={barClassName}
      style={selectStyles}
    >
      {isIcon && <Icon icon={111} />}
      <div className="content">{content}</div>
    </div>
  );
}
