import { Dimensions } from "react-native";
import { getScreenSize } from '@Utils/getScreenSize'
// const deviceWidthDp = Dimensions.get("window").width;

// 默认设计稿375
const uiWidthPx = 375;
export function dp2px(uiElementPx: number) {
    return (uiElementPx * getScreenSize('width')) / uiWidthPx;
}
export default dp2px;
