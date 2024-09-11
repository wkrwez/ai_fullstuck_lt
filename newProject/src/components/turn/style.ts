import { StyleSheet, dp2px } from '@/src/utils';
import { OUTER_RADIUS } from './const'
export default StyleSheet.create({
    $wrap: {
        width: OUTER_RADIUS * 2,
        height: OUTER_RADIUS * 2,
        borderRadius: 500
    },
    $full: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
        right: 0
    },
    $turnBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
    },
    $optionText: {
        position: 'relative',
        textAlign: 'center',
        left: 30,
        fontSize: 15,
        color: StyleSheet.currentColors.white,

    },
    $cateTurnOptionWrap: {
        top: 0
    },
    $optionText_category: {
        // top: -10,
        // left: 20,
        // transform: [{ rotate: '4deg' }]
    },
    $optionText_option: {
        // top: -9,
        // left: -30,
        // transform: [{ rotate: '1deg' }]
    },
    $optionTextSelected: {
        fontSize: 20,
        fontWeight: '900',
        color: '#9EEEFF'
    },
    $optionLine: {
        position: 'absolute',
        bottom: -30,
        left: 0,
        width: 112.5,
        height: 2
    },
    $optionLine_category: {
        // left: -10,
        // transform: `rotate(-2deg)`
        transform: `rotate(-10deg)`
    },
    $optionLine_option: {
        // left: -70,
        transform: `rotate(-7.5deg)`
    },
    $optionSelected: {
        // position: 'absolute',
        // width: 169,
        // height: 90,
        // left: -103,
        // top: -40,
        // transform: 'rotate(6deg)'
    },
    $optItemWrap(inner: number) {
        return ({
            position: 'absolute',
            // backgroundColor: '#ff0000', // mock
            // height: 50,
            // width: (OUTER_RADIUS - inner) / 2,
        })
    },
    $trunOptsWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: OUTER_RADIUS * 2,
        height: OUTER_RADIUS * 2,
        // backgroundColor: '#ff0000'
    },
    $turnLine: {
        // position: 'absolute',
        // top: 36,
        // left: 33,
        // width: 280,
        // height: 280
    }
});