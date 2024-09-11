import { Platform } from "react-native";
import { colors } from "./colorsUI";

export let $cursorColorStyle: {
  selectionColor?: string;
  cursorColor?: string;
  keyboardAppearance: 'dark' | 'light' | 'default';
} = { selectionColor: colors.primary, keyboardAppearance: 'dark' };
if (Platform.OS === 'ios') {
  $cursorColorStyle = { ...$cursorColorStyle, cursorColor: colors.primary };
}
