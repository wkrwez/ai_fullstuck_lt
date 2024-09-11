import { currentColors } from "@/src/theme";
import { StyleSheet } from "@/src/utils";

export default StyleSheet.create({
    $wrapStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 12,
        height: 12,
        borderRadius: 500,
        borderWidth: 1.5,
        borderColor: currentColors.white1,
    },
    $checked: {
        borderWidth: 0,
    },
    $checkedBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        borderRadius: 500,
        borderColor: '#FFFFFF'
    }
})