import React, { type CSSProperties, useEffect, useState } from "react";
import { getMaskStyle } from "./getMaskStyle";

interface MaskProps {
  element: HTMLElement; // 包裹的元素
  container?: HTMLElement; // 挂载的节点
  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;
}

export const Mask: React.FC<MaskProps> = (props) => {
  const { element, renderMaskContent, container } = props;

  const [style, setStyle] = useState<CSSProperties>({});
  useEffect(() => {
    if (!element) {
      return;
    }
    element.scrollIntoView({
      block: "center",
      inline: "center",
    });

    const style = getMaskStyle(element, container || document.documentElement);

    setStyle(style);
  }, [element, container]);

  const getContent = () => {
    if (!renderMaskContent) {
      return null;
    }

    return renderMaskContent(
      <div
        className={"mask-content"}
        style={{ width: "100%", height: "100%" }}
      ></div>,
    );
  };

  return (
    <div
      style={style}
      className="mask"
    >
      {getContent()}
    </div>
  );
};
