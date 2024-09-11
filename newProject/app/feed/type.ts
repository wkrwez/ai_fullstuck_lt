import { RichCardInfo as RawRichCardInfo } from '@/src/types';

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
  TOPIC_WORLD = 'root_world',
  SEARCH = 'homeSearchTab',
  SEARCH_RECOMMEND = 'search_rec'
}

export enum SearchFeatureName {
  GAME_TYPE = 'game_type_tab'
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

export enum EHomeIP {
  'GUIMIEZHIREN' = 0,
  'ZHOUSHUHUIZHAN' = 1,
  'HUOYINGRENZHE' = 2,
  'JINJIDEJUREN' = 3,
  'HAIZEIWANG' = 4,
  'MODAOZUSHI' = 5,
  'JOJO' = 6,
  'TIANGUANCIFU' = 7,
  'SANGUOYANYI' = 8,
  'ZHENHUANZHUAN' = 9,
  'HULUXIONGDI' = 10,
  'UNKNOWN' = -1,
  'WISHCARD' = -2
}

export interface EHomeIPCard {
  id: number | string;
  ip: EHomeIP;
  title: string;
  url: string;
  color: string;
  type: ETagIp;
}

// 获取所有枚举值的数组
const allHomeIPs: EHomeIP[] = Object.values(EHomeIP).filter(
  value => typeof value === 'number'
) as EHomeIP[];

type RichCardInfoParameters = ConstructorParameters<
  typeof RawRichCardInfo
>[0] & {
  isAppend?: boolean;
};
export class FeedRichCardInfo extends RawRichCardInfo {
  /**
   * 消息生成中
   */
  isAppend?: boolean = false;
  constructor(data: RichCardInfoParameters) {
    super(data);
    this.isAppend = !!data.isAppend;
  }
}
