import {
  useRef,
  type PropsWithChildren,
  type CSSProperties,
  type FC,
  useCallback,
  useEffect,
} from "react";
import useWatermark from "./useWatermark.ts";

export interface WatermarkProps extends PropsWithChildren {
  style?: CSSProperties;
  className?: string;
  /** 水印图层的 z-index，默认为 1 */
  zIndex?: string | number;
  /** 单个水印单元的宽度 */
  width?: number;
  /** 单个水印单元的高度 */
  height?: number;
  /** 水印旋转角度（度），默认为 -20 */
  rotate?: number;
  /** 水印图片 URL，优先级高于文字水印 */
  image?: string;
  /** 水印文字内容，支持多行（数组） */
  content?: string | string[];
  /** 文字样式：颜色、字体、字号、粗细 */
  fontStyle?: {
    color?: string;
    fontFamily?: string;
    fontSize?: number | string;
    fontWeight?: number | string;
  };
  /** 水印单元之间的间距 [水平, 垂直]，默认为 [100, 100] */
  gap?: [number, number];
  /** 水印图层相对于容器的偏移量 [左, 上] */
  offset?: [number, number];
  /** 自定义水印挂载容器，默认挂载到当前组件 wrapper 或 document.body */
  getContainer?: () => HTMLElement;
}

const Watermark: FC<WatermarkProps> = (props) => {
  const {
    className,
    style,
    zIndex,
    width,
    height,
    rotate,
    image,
    content,
    fontStyle,
    gap,
    offset,
  } = props;

  // 包装容器的 ref，用于在没有自定义 getContainer 时作为水印挂载点
  const containerRef = useRef<HTMLDivElement>(null);

  // 获取水印挂载容器：优先使用用户指定的 getContainer，否则回退到 wrapper div
  const getContainer = useCallback(() => {
    return props.getContainer ? props.getContainer() : containerRef.current!;
  }, [containerRef.current, props.getContainer]);

  const { generateWatermark } = useWatermark({
    zIndex,
    width,
    height,
    rotate,
    image,
    content,
    fontStyle,
    gap,
    offset,
    getContainer,
  });

  // 当任意水印属性变化时，重新生成水印
  // fontStyle/gap/offset 是对象/数组，用 JSON.stringify 做浅层比较
  useEffect(() => {
    generateWatermark({
      zIndex,
      width,
      height,
      rotate,
      image,
      content,
      fontStyle,
      gap,
      offset,
      getContainer,
    });
  }, [
    zIndex,
    width,
    height,
    rotate,
    image,
    content,
    JSON.stringify(props.fontStyle),
    JSON.stringify(props.gap),
    JSON.stringify(props.offset),
    getContainer,
  ]);

  // 无 children 时不渲染任何 DOM（水印通过 portal 方式注入到 getContainer 中）
  return props.children ? (
    <div
      className={className}
      style={style}
      ref={containerRef}
    >
      {props.children}
    </div>
  ) : null;
};

export default Watermark;
