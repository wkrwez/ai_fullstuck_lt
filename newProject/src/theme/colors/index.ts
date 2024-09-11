import { CommonColor } from "./common";
import { BlueColor } from './blue'

export enum ThemeType {
    primary = 'primary'
}
const pickTheme = (theme: ThemeType) => {
    switch (theme) {
        case 'primary':
            return { ...CommonColor, subset: { blue: BlueColor } }
        default:
            return { ...CommonColor, subset: { blue: BlueColor } }
    }
}

function hexToRgb(hex: string) {
    // 如果输入的是一个已经以rgb(a)格式表示的颜色，则直接返回
    if (hex.startsWith("rgb")) {
        return (hex.match(/\d+/g) || []).map(Number);
    }

    // 删除前缀'#'
    hex = hex.replace("#", "");

    // 处理六位和三位的十六进制颜色值
    if (hex.length === 6) {
        return [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16)
        ];
    } else if (hex.length === 3) {
        return [
            parseInt(hex[0] + hex[0], 16),
            parseInt(hex[1] + hex[1], 16),
            parseInt(hex[2] + hex[2], 16)
        ];
    }

    // 如果输入的格式不正确，则返回null
    return null;
}

export const hex = (hexString: string, opacity: number) => {
    return `rgba(${hexToRgb(hexString || '')?.join(',')}, ${opacity})`
}

export const currentColors = pickTheme(ThemeType.primary)