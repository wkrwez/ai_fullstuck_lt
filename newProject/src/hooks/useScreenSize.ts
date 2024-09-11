import { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';

export function useScreenSize(mode: 'window' | 'screen' = 'window') {
    const [screenSize, setScreenSize] = useState({
        width: Dimensions.get(mode)?.width || 0,
        height: Dimensions.get(mode)?.height || 0,
    });
    // update 屏幕尺寸，定义圆心
    useEffect(() => {
        const updateScreenSize = () => {
            const { width, height } = Dimensions.get(mode) || {};
            setScreenSize({ width, height });
        };
        const sub = Dimensions.addEventListener('change', updateScreenSize);
        return () => sub?.remove();
    }, [screenSize]);
    return screenSize;
}
