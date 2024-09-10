import React, { useState } from "react";
import "./index.scss";
import Icon from "../icon/icon";
interface InputProps {
  name: string;
  type?: string;
  inputStyle?: React.CSSProperties;
  placeholder?: string;
  onClick?: () => void;
}

export function Input(props: InputProps) {
  const { type = "text", inputStyle, placeholder, onClick, name } = props;

  const [value, setValue] = useState("");

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  function handleClick() {
    if (onClick) {
      onClick();
    }
  }
  function handleClear() {
    setValue("");
  }
  return (
    <div className="inputBox">
      <input
        type={type}
        value={value}
        name={name}
        className="input"
        style={inputStyle}
        placeholder={placeholder}
        onClick={handleClick}
        onChange={handleInputChange}
      />
      <Icon
        icon={"deleteIcon"}
        size={20}
        onClick={handleClear}
        iconStyles={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          right: 10,
        }}
      />
    </div>
  );
}
