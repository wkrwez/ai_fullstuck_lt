import Color from 'color';

// TODO: 解决兜底色问题
export const opacityColor = (color: string, opacity: number = 1) => {
  opacity = Math.max(Math.min(1, opacity), 0);
  try {
    return Color(color).alpha(opacity).rgb().string();
  } catch (e) {
    return `rgba(34,34,34,1)`;
  }
};

// 落地页配色，以 marquee 色为基准去减轻亮度
export const lightenColor = (color: string, lightness: number = 0) => {
  const light = Color(color).lightness();
  try {
    return Color(color)
      .lightness(light - 56 + lightness)
      .rgb()
      .string();
  } catch (e) {
    return `rgba(34,34,34,1)`;
  }
};

export const saturateColor = (color: string) => {
  try {
    return Color(color).saturate(0.7).rgb().string();
  } catch (e) {
    return undefined;
  }
};

// 原色值，marquee ip 基准色
export const getMarqueeIPColor = (color: string) => {
  try {
    const light = Color(color).lightness();
    return Color(color).lightness(light).rgb().string();
  } catch (e) {
    return color;
  }
};

// 特殊预约浅色
export const lightenIPReserveColor = (color: string) => {
  try {
    return Color(color).lightness(90).saturate(0.1).rgb().string();
  } catch (e) {
    return color;
  }
};
