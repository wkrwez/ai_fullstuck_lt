import { TextStyle, ViewStyle } from 'react-native';
import { DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { currentColors } from '@/src/theme';
import { PRESERVE_GAP_FOR_DEBOUNCE } from './const';

export const $containerStyle: ViewStyle = {
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  position: 'absolute',
  backgroundColor: currentColors.white,
  bottom: -1 * PRESERVE_GAP_FOR_DEBOUNCE,
  left: 0,
  right: 0,
  zIndex: DEFAULT_SHEET_ZINDEX
};

export const $headerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  justifyContent: 'space-between',
  marginBottom: 12
};

export const $titleStyle: TextStyle = {
  flex: 1,
  fontWeight: '500',
  color: currentColors.white
};

export const $maskStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: DEFAULT_SHEET_ZINDEX
};
