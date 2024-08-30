import React from "react";
import "./index.scss";

type buttonType = "button" | "submit" | "reset";

interface ButtonProps {
  content: string;
  type?: buttonType;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
  onButtonClick: () => void;
}

export function Button(props: ButtonProps) {
  const {
    type,
    buttonStyle,
    onButtonClick,
    content,
    buttonClassName = "button",
  } = props;

  const handleClick = () => {
    console.log("点击了按钮");
    onButtonClick();
  };
  return (
    <button
      type={type}
      className={buttonClassName}
      style={buttonStyle}
      onClick={handleClick}
    >
      {content}
    </button>
  );
}
