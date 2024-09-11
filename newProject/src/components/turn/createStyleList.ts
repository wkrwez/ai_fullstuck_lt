
import { OUTER_RADIUS, SPACE, ROT } from './const'
import { StyleSheet, dp2px } from '@/src/utils';
import { radians } from './utils';

const T = dp2px(OUTER_RADIUS)
export const createStyleList = (radius: number, rot: number) => {
    const result = [];
    for (let i = 0; i < 30; i++) {
        result.push(
            {
                // top: 0,
                // left: 0,
                // top: T - T * Math.cos(radians(rot * i)),
                // left: T - T * Math.sin(radians(rot * i)),
                top: T - (radius + dp2px(SPACE)) * Math.cos(radians(rot * i)),
                left:
                    T - (radius + dp2px(SPACE)) * Math.sin(radians(rot * i)),
                textDeg: 90 - rot * i,
                rotate: -90 + rot * i
                // textDeg: 0,
                // rotate: 0
            }
        );
    }
    return result;
};

// export const rotateList = createStyleList(); // 先计算好一堆