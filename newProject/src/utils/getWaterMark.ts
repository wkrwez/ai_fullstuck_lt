import { SwitchName, useControlStore } from '../store/control';

const WATERMARK_PARAM = '~tplv-gtvilk3tio-lipu-watermarker-v3.png';
const WATERMARK_PARAMAI = '~tplv-gtvilk3tio-lipu-watermarker-v4.png';
const WATERMARK_EMOJI = '~tplv-gtvilk3tio-lipu-wmk-emoji.png';

export enum WaterMarkType {
  AIGC = 'aigc',
  EMOJI = 'emoji',
  NO_WMK = 'no_water_mark'
}

export const getWaterMark = (type = WaterMarkType.AIGC) => {
  switch (type) {
    case WaterMarkType.EMOJI:
      return WATERMARK_EMOJI;
    case WaterMarkType.NO_WMK:
      return '';
    default:
      return useControlStore
        .getState()
        .checkIsOpen(SwitchName.DISABLE_AI_WATER_MARK)
        ? WATERMARK_PARAM
        : WATERMARK_PARAMAI;
  }
};

export function isImagexUrl(url: string) {
  return url.indexOf('mediafile.lipuhome.com') > -1;
}
