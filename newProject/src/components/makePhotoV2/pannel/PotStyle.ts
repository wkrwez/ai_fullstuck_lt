import { StyleSheet } from '@Utils/StyleSheet';
import { PAGE_TOP, PANNEL_TOP } from '../constant';

export const $potStyle = StyleSheet.createRectStyle({
  marginTop: PAGE_TOP,
  top: PANNEL_TOP + 97,
  left: 37,
  right: 105,
  height: payload => (230 / 236) * (Number(payload.width) || 0)
});
