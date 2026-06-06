import { useEffect, useRef, useState } from "react";
import type { WatermarkProps } from "./watermark.tsx";
import { merge } from "lodash-es";

// 从 WatermarkProps 中排除 React 特有的 className/style/children，得到纯配置类型
export type WatermarkOptions = Omit<
  WatermarkProps,
  "className" | "style" | "children"
>;

/**
 * 类型守卫：判断一个值是否为合法的数字（排除 NaN）
 */
export function isNumber(obj: any): obj is number {
  return (
    Object.prototype.toString.call(obj) === "[object Number]" && obj === obj
  );
}

/**
 * 将可能为字符串的值转为数字，转换失败或值为空时返回默认值
 */
const toNumber = (value?: string | number, defaultValue?: number) => {
  if (!value) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue;
};

// 水印默认配置：旋转 -20°、z-index 1、100px 宽、间距 [100,100]、半透明黑色 16px sans-serif
const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.15)",
    fontFamily: "sans-serif",
    fontWeight: "normal",
  },
  getContainer: () => document.body,
};

/**
 * 将用户传入的选项与默认值合并，并对 width/height/gap/offset 做数字类型转换
 * 返回所有字段均已确认的 Required<WatermarkOptions>
 */
const getMergedOptions = (o: Partial<WatermarkOptions>) => {
  const options = o || {};

  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    width: toNumber(
      options.width,
      options.image ? defaultOptions.width : undefined,
    ),
    height: toNumber(options.height, undefined)!,
    getContainer: options.getContainer!,
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
  } as Required<WatermarkOptions>;

  // offset 的 Y 值若不传则复用 X 值
  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
  const mergedOffsetY = toNumber(
    mergedOptions.offset?.[1] || mergedOptions.offset?.[0],
    0,
  )!;
  mergedOptions.offset = [mergedOffsetX, mergedOffsetY];

  return mergedOptions;
};

/**
 * 使用 Canvas 生成水印图案的 base64 DataURL
 * 支持文字水印（drawText）和图片水印（drawImage），图片加载失败时降级为文字水印
 *
 * @returns canvas 的宽高及 base64 图片数据
 */
const getCanvasData = async (
  options: Required<WatermarkOptions>,
): Promise<{ width: number; height: number; base64Url: string }> => {
  const { rotate, image, content, fontStyle, gap } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // 设备像素比，保证高清屏下画布清晰
  const ratio = window.devicePixelRatio;

  /**
   * 配置 Canvas 尺寸与变换：
   * 1. 按 gap + 内容尺寸设置画布宽高，并乘以设备像素比
   * 2. 将坐标原点平移至画布中心
   * 3. 应用旋转角度
   */
  const configCanvas = (size: { width: number; height: number }) => {
    const canvasWidth = gap[0] + size.width;
    const canvasHeight = gap[1] + size.height;

    canvas.setAttribute("width", `${canvasWidth * ratio}px`);
    canvas.setAttribute("height", `${canvasHeight * ratio}px`);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
    ctx.scale(ratio, ratio);

    const RotateAngle = (rotate * Math.PI) / 180;
    ctx.rotate(RotateAngle);
  };

  /**
   * 在 Canvas 上绘制文字水印
   * 支持多行文字，每行居中排列，底部对齐
   */
  const drawText = () => {
    const { fontSize, color, fontWeight, fontFamily } = fontStyle;
    const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    const measureSize = measureTextSize(ctx, [...content], rotate);

    const width = options.width || measureSize.width;
    const height = options.height || measureSize.height;

    configCanvas({ width, height });

    ctx.fillStyle = color!;
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    ctx.textBaseline = "top";

    // 逐行绘制文字，每行从自身中心点开始，使整体居中
    [...content].forEach((item, index) => {
      const { height: lineHeight, width: lineWidth } =
        measureSize.lineSize[index];

      const xStartPoint = -lineWidth / 2;
      const yStartPoint =
        -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

      ctx.fillText(
        item,
        xStartPoint,
        yStartPoint,
        options.width || measureSize.originWidth,
      );
    });
    return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
  };

  /**
   * 在 Canvas 上绘制图片水印
   * 图片居中绘制，宽高可按比例自适应，加载失败时降级为文字水印
   */
  function drawImage() {
    return new Promise<{ width: number; height: number; base64Url: string }>(
      (resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";

        img.src = image;
        img.onload = () => {
          let { width, height } = options;
          // 若只指定了宽或高，则按图片原始比例计算另一边
          if (!width || !height) {
            if (width) {
              height = (img.height / img.width) * +width;
            } else {
              width = (img.width / img.height) * +height;
            }
          }
          configCanvas({ width, height });

          // 以画布中心为原点绘制图片，使图片居中
          ctx.drawImage(img, -width / 2, -height / 2, width, height);
          return resolve({ base64Url: canvas.toDataURL(), width, height });
        };
        // 图片加载失败时降级为文字水印
        img.onerror = () => {
          return drawText();
        };
      },
    );
  }

  // 有 image 走图片水印，否则走文字水印
  return image ? drawImage() : drawText();
};

/**
 * 水印核心 hook
 * 负责生成水印 DOM、挂载到容器、并通过 MutationObserver 防止水印被删除或篡改
 *
 * @returns generateWatermark —— 调用后（重新）生成水印
 * @returns destroy —— 销毁水印（当前未实现具体逻辑）
 */
export default function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params || {});

  const mergedOptions = getMergedOptions(options);
  const watermarkDiv = useRef<HTMLDivElement>(null);
  const mutationObserver = useRef<MutationObserver>(null);

  const container = mergedOptions.getContainer();
  const { zIndex, gap } = mergedOptions;

  /**
   * 绘制/重建水印的核心方法：
   * 1. 通过 getCanvasData 生成 base64 水印图
   * 2. 创建（或复用）一个 div，用 CSS background-image 重复平铺水印图
   * 3. 设置绝对定位覆盖整个容器，pointer-events: none 不阻挡交互
   * 4. 启动 MutationObserver 监听水印 DOM 是否被删除/篡改，一旦发生则自动重建
   */
  function drawWatermark() {
    if (!container) {
      return;
    }

    getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
      const offsetLeft = mergedOptions.offset[0] + "px";
      const offsetTop = mergedOptions.offset[1] + "px";

      // 水印 div 的完整内联样式：绝对定位覆盖容器，背景重复平铺水印图
      const wmStyle = `
        width:calc(100% - ${offsetLeft});
        height:calc(100% - ${offsetTop});
        position:absolute;
        top:${offsetTop};
        left:${offsetLeft};
        bottom:0;
        right:0;
        pointer-events: none;
        z-index:${zIndex};
        background-position: 0 0;
        background-size:${gap[0] + width}px ${gap[1] + height}px;
        background-repeat: repeat;
        background-image:url(${base64Url})`;

      // 首次调用时创建水印 div 并挂载到容器
      if (!watermarkDiv.current) {
        const div = document.createElement("div");
        watermarkDiv.current = div;
        container.append(div);
        // 容器需设为 relative 以使水印 div 的 absolute 定位生效
        container.style.position = "relative";
      }

      watermarkDiv.current?.setAttribute("style", wmStyle.trim());

      if (container) {
        // 先断开旧的观察器，避免重复监听
        mutationObserver.current?.disconnect();

        /**
         * 创建 MutationObserver 监控容器变化：
         * - 水印 div 被从 DOM 中删除 → 重建水印
         * - 水印 div 的属性被篡改 → 重建水印
         * 以此防止用户通过开发者工具删除或修改水印
         */
        mutationObserver.current = new MutationObserver((mutations) => {
          const isChanged = mutations.some((mutation) => {
            let flag = false;
            if (mutation.removedNodes.length) {
              flag = Array.from(mutation.removedNodes).some(
                (node) => node === watermarkDiv.current,
              );
            }
            if (
              mutation.type === "attributes" &&
              mutation.target === watermarkDiv.current
            ) {
              flag = true;
            }
            return flag;
          });
          if (isChanged) {
            // 水印被破坏，移除残留节点并重新绘制
            watermarkDiv.current?.parentNode?.removeChild(watermarkDiv.current);
            watermarkDiv.current = undefined;
            drawWatermark();
          }
        });

        // 监听容器的子节点变化、子树属性变化、子节点增删
        mutationObserver.current.observe(container, {
          attributes: true,
          subtree: true,
          childList: true,
        });
      }
    });
  }

  // options 变化时重新绘制水印
  useEffect(() => {
    drawWatermark();
  }, [options]);

  return {
    /**
     * 外部调用此方法更新水印配置（如切换暗色模式、动态修改文字等）
     * 使用 lodash merge 将新选项深度合并到现有选项中
     */
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    },
    /** 销毁水印（预留，当前未实现） */
    destroy: () => {},
  };
}

/**
 * 使用 Canvas measureText 测量多行文字的实际渲染尺寸
 * 考虑旋转角度，计算旋转后外接矩形的宽高
 *
 * @param ctx    Canvas 2D 渲染上下文
 * @param content 文字行数组
 * @param rotate  旋转角度（度）
 * @returns 原始尺寸、旋转后外接矩形尺寸、每行尺寸
 */
const measureTextSize = (
  ctx: CanvasRenderingContext2D,
  content: string[],
  rotate: number,
) => {
  let width = 0;
  let height = 0;
  const lineSize: Array<{ width: number; height: number }> = [];

  // 测量每行文字的宽高，找出最大宽度和累计高度
  content.forEach((item) => {
    const {
      width: textWidth,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent,
    } = ctx.measureText(item);

    const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

    if (textWidth > width) {
      width = textWidth;
    }

    height += textHeight;
    lineSize.push({ height: textHeight, width: textWidth });
  });

  const angle = (rotate * Math.PI) / 180;

  /**
   * 旋转后的外接矩形尺寸计算：
   * 原始矩形 (w, h) 绕中心旋转 θ 后，新的外接矩形：
   *   newWidth  = |sinθ| * h  +  |cosθ| * w
   *   newHeight = |sinθ| * w  +  |cosθ| * h
   * 这样可以确保画布足够容纳旋转后的文字
   */
  return {
    originWidth: width,
    originHeight: height,
    width: Math.ceil(
      Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width),
    ),
    height: Math.ceil(
      Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle)),
    ),
    lineSize,
  };
};
