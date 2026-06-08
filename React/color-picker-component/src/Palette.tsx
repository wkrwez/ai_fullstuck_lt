import { useRef, type FC } from "react";
import { Color } from "./ColorPicker/color";
import Handler from "./components/Handler";
import Transform from "./components/Transform";
import useColorDrag from "./utils/useColorDrag";
import { calculateColor, calculateOffset } from "./utils/colorUtils";
const Palette: FC<{
  color: Color;
  onChange?: (color: Color) => void;
}> = ({ color, onChange }) => {
  const transformRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, dragStartHandle] = useColorDrag({
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    targetRef: transformRef as React.RefObject<HTMLDivElement>,
    onDragChange: (offsetValue) => {
      const newColor = calculateColor({
        offset: offsetValue,
        containerRef: containerRef as React.RefObject<HTMLDivElement>,
        targetRef: transformRef as React.RefObject<HTMLDivElement>,
        color,
      });
      onChange?.(newColor);
    },
    calculate: () => {
      return calculateOffset(
        containerRef as React.RefObject<HTMLDivElement>,
        transformRef as React.RefObject<HTMLDivElement>,
        color,
      );
    },
  });
  return (
    <div
      ref={containerRef}
      className="color-picker-panel-palette"
      onMouseDown={dragStartHandle} // 鼠标按下触发
    >
      <Transform
        ref={transformRef}
        offset={{ x: offset.x, y: offset.y }}
      >
        <Handler color={color.toRgbString()} />
      </Transform>

      <div
        className="color-picker-panel-palette-main"
        style={{
          backgroundColor: `hsl(${color.toHsl().h},100%, 50%)`,
          backgroundImage:
            "linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))",
        }}
      />
    </div>
  );
};

export default Palette;
