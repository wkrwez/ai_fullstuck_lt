import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { OUTER_RADIUS, INNER_RADIUS, SPACE } from './const';
import { dp2px, isPointInCircle } from '@/src/utils';
import { Dimensions } from 'react-native';

export const pan = Gesture.Pan();


const { height } = Dimensions.get('window')
const o = { x: dp2px(OUTER_RADIUS), y: dp2px(height + OUTER_RADIUS - 330) } // 圆心坐标

export function createPan(update: (delta: number, inner: boolean) => void, onEnd: (inner: boolean) => void) {
    let lastY = 0;
    let lastX = 0;
    let inner = false
    pan
        .enabled(true)
        .onStart(e => {
            lastX = 0;
            lastY = 0;
            // 判断是哪个转盘要转
            inner = isPointInCircle({
                x: e.absoluteX,
                y: e.absoluteY
            }, o, dp2px(INNER_RADIUS + 50))
        })
        .onUpdate(e => {
            const deltaX = e.translationX - lastX;
            const deltaY = e.translationY - lastY;
            if (!deltaX && !deltaY) return;
            if (deltaX <= 0 && deltaY >= 0) {
                update(Math.min(deltaX, 0 - deltaY), inner);
                // console.log('左滑-----负值');
            }
            if (deltaX >= 0 && deltaY <= 0) {
                // console.log('右滑----正值');
                update(Math.min(deltaX, 0 - deltaY), inner);
            }
            lastX = e.translationX;
            lastY = e.translationY;
        })
        .onEnd(e => {
            lastX = 0;
            lastY = 0;
            onEnd(inner);
            console.log('end-------', e);
        });

    return pan;
}
