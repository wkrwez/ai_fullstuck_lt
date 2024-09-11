import { Dimensions } from 'react-native';

// emoji相关页面组件对应的路由
export enum EMOJI_PAGE {
  CREATE = 0,
  PREVIEW = -1,
  RECREATE = 'recreate'
}

// 页面展示的Emoji尺寸
const screen = Dimensions.get('screen');
export const EMOJI_SIZE = screen.width - 88;

// 埋点相关
export enum RECREATE_TYPE {
  // 0=重新生成按钮
  RECREATE,
  // 1=手动输入点击箭头按钮
  INPUT,
  // 2=选择角色
  ROLE,
  // 3=推荐字段
  ADVICE,
  // 4=做同款表情
  SAME
}
