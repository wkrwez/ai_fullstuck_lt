import { useEffect, useRef, useState } from "react";
import { TransformOffset } from "../components/Transform";
import { Color } from "../ColorPicker/color";
/*
1. MouseEvent 是 ts 内置的原生鼠标事件类型，而 React.MouseEvent 是 react 提供鼠标事件类型。
2. 直接给 document 绑定事件，这时候 event 是 MouseEvent 类型
3. 在 jsx 里绑定事件，这时候 event 是 React.MouseEvent 类型
*/
type EventType = MouseEvent | React.MouseEvent<Element, MouseEvent>;

type EventHandle = (e: EventType) => void;

interface useColorDragProps {
  color?: Color;
  containerRef: React.RefObject<HTMLDivElement>;
  targetRef: React.RefObject<HTMLDivElement>;
  offset?: TransformOffset;
  direction?: "x" | "y";
  onDragChange?: (offset: TransformOffset) => void;
  calculate?: () => TransformOffset;
}

function useColorDrag(
  props: useColorDragProps,
): [TransformOffset, EventHandle] {
  const {
    color,
    offset,
    containerRef,
    targetRef,
    direction,
    onDragChange,
    calculate,
  } = props;
  const [offsetValue, setOffsetValue] = useState<TransformOffset>(
    offset || { x: 0, y: 0 },
  );
  const dragRef = useRef({ flag: false });

  useEffect(() => {
    if (!dragRef.current.flag) {
      const calcOffset = calculate?.();
      if (calcOffset) {
        setOffsetValue(calcOffset);
      }
    }
  }, [color]);
  useEffect(() => {
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragStop);
  }, []);

  const updateOffset: EventHandle = (e) => {
    const scrollXOffset =
      document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollYOffset =
      document.documentElement.scrollTop || document.body.scrollTop;
    // 元素距离可视区域左侧的位置
    const pageX = e.pageX - scrollXOffset;
    const pageY = e.pageY - scrollYOffset;

    // 主容器属性
    const {
      x: rectX,
      y: rectY,
      width,
      height,
    } = containerRef.current!.getBoundingClientRect();
    // 拖动容器的宽高
    const { width: targetWidth, height: targetHeight } =
      targetRef.current!.getBoundingClientRect();

    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;
    // 水平偏移量：
    const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
    const offsetY =
      Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;

    const calcOffset = {
      x: offsetX,
      y: direction === "x" ? offsetValue.y : offsetY,
    };

    setOffsetValue(calcOffset);
    onDragChange?.(calcOffset);
  };

  const onDragStop: EventHandle = (e) => {
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragStop);

    dragRef.current.flag = false;
  };

  const onDragMove: EventHandle = (e) => {
    e.preventDefault();
    updateOffset(e);
  };

  const onDragStart: EventHandle = (e) => {
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragStop);

    dragRef.current.flag = true;
  };

  return [offsetValue, onDragStart];
}

export default useColorDrag;
