import {
  Dimension,
  LayoutProvider,
  MasonryLayoutProvider
} from 'recyclerlistview-masonrylayoutmanager';
import { getScreenSize } from '@/src/utils';
import {
  CardInfo,
  RichCardInfo
} from '@step.ai/proto-gen/raccoon/common/showcase_pb';

export enum EWaterFallType {
  TWO_COLUMNS = 0,
  FULLSCREEN_TWO_COLUMNS = 1
}

const windowWidth = getScreenSize('width');

export const EQUAL_INDEX = [0, 6];
export const LayoutUtil = {
  getWindowWidth: () => {
    const padding = 12;
    return Math.round((windowWidth - padding) / 2);
  },
  setDimSize: (
    dim: Dimension,
    card: CardInfo | undefined,
    type: string | number,
    cardSize: {
      width: number;
      height: number;
    }
  ) => {
    if (!card) {
      dim.width = 1;
      dim.height = 1;
      return;
    }

    switch (type) {
      case 'Item': {
        dim.width = cardSize.width;
        dim.height = cardSize.height + 83; //下方卡片 max
        break;
      }
      default:
        dim.width = cardSize.width;
        dim.height = 300;
        break;
    }
  },
  getLayoutProvider: (type: EWaterFallType, data: RichCardInfo[]) => {
    switch (type) {
      case EWaterFallType.TWO_COLUMNS: {
        return new MasonryLayoutProvider(
          2,
          () => {
            return 'Item';
          },
          (type, dim, index) => {
            const halfWidth = LayoutUtil.getWindowWidth();
            const card = data[index]?.card;
            const ratio = card ? getRatio(card, halfWidth, index) : 1;
            const realHeight = halfWidth * ratio;

            LayoutUtil.setDimSize(dim, card, type, {
              width: halfWidth,
              height: realHeight
            });
          }
        );
      }
      case EWaterFallType.FULLSCREEN_TWO_COLUMNS: {
        return new MasonryLayoutProvider(
          2,
          (...params) => {
            return 'Item';
          },
          (type, dim, index) => {
            const halfWidth = Math.round(windowWidth / 2);
            const card = data[index]?.card;
            const ratio = card ? getRatio(card, halfWidth, index) : 1;
            const realHeight = halfWidth * ratio;

            LayoutUtil.setDimSize(dim, card, type, {
              width: halfWidth,
              height: realHeight
            });
          }
        );
      }
      default: {
        return new LayoutProvider(
          () => {
            return 'Item';
          },
          (type, dim) => {
            switch (type) {
              case 'Item':
                dim.width = windowWidth;
                dim.height = 300;
                break;
              default:
                dim.width = windowWidth;
                dim.height = 300;
            }
          }
        );
      }
    }
  }
};

export function getRatio(card: CardInfo, cardWidth: number, index: number) {
  let ratio = card.displayImageHeight / (card.displayImageWidth || 1);
  if (card?.resourceInfo?.resourceList) {
    // 如果存在运营位置
    ratio =
      (card?.resourceInfo?.resourceList?.[0]?.image?.height || 0) /
      (card?.resourceInfo?.resourceList?.[0]?.image?.width || 1);
  }

  if (EQUAL_INDEX.includes(index)) {
    ratio = 1;
  }

  // if (ratio < 0.7 || ratio > 1.4) return ratio;
  if (card.title.length > 16) {
    ratio *= 1.1;
  }
  // if (card.title.length < 12) {
  //   ratio *= 0.8;
  // }

  return ratio;
}
