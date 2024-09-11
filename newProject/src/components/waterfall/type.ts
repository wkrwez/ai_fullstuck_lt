import { RichCardInfo } from '@/src/types';
import { IInfiniteListProps } from '../infiniteList/typing';
import { FeedRichCardInfo } from '@/app/feed/type';

export enum ETagIp {
  HOT = 'hot',
  NORMAL = 'normal',
  SSR = 'ssr'
}

export enum ETabIp {
  RECOMMEND = 0,
  TONGUEBATTLE = 1,
  STRATEGY = 2,
  FOLLOW = -100
}

export enum RecSceneName {
  HOME_TAB = 'home_tab',
  IP_LANDING = 'ip_landing',
  WEB5_REC = 'web5_rec',
  TOPIC_WORLD = 'BrandWorldRecTab'
}

export enum EWaterFallType {
  TWO_COLUMNS = 0,
  FULLSCREEN_TWO_COLUMNS = 1
}

export interface ICellCardData {
  url: string;
  width: number;
  height: number;
  title: string;
  username: string;
  type: string;
}

export type WaterFallCardData = RichCardInfo | FeedRichCardInfo;

export interface IWaterFallProps
  extends Partial<IInfiniteListProps<WaterFallCardData>> {
  // 埋点控制，用于计算卡片的曝光和离开时机
  isActive?: boolean;
  // 埋点参数
  reportParams?: Record<string, string | number | boolean | undefined>;
  // 卡片曝光事件
  onCardExposure?: (data: WaterFallCardData) => void;
  // 卡片离开事件
  onCardLeave?: (data: WaterFallCardData) => void;
}
