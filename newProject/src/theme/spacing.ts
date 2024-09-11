export const spacing = {
  xxxs: 2,
  xxs: 3,
  xs: 8,
  sm: 12,
  md: 16,
  mlg: 20, // 视觉喜欢这个值
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type Spacing = keyof typeof spacing;
