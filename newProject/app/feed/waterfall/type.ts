import { GameType } from '@/proto-registry/src/web/raccoon/common/types_pb';

export enum EWaterFallTabType {
  RECOMMEND = 'RECOMMEND',
  FOLLOW = 'FOLLOW',
  SEARCH_ALL = 'SEARCH_ALL',
  SEARCH_MAKEPHOTO = 'SEARCH_MAKEPHOTO',
  SEARCH_WORLD = 'SEARCH_WORLD'
}

export const EWaterFallTabReportType = {
  [EWaterFallTabType.RECOMMEND]: 'discovertab',
  [EWaterFallTabType.FOLLOW]: 'followtab'
};

export const ECellCardReportType = {
  [GameType.DRAWING]: 'nietu',
  [GameType.WORLD]: 'universe',
  [GameType.UNKNOWN]: 'unknown',
  [GameType.TALK]: 'talk',
  [GameType.STRATEGY]: 'strategy',
  [GameType.FIGHT]: 'fight'
};
