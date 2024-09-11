import { Dimensions, View } from 'react-native';

export const getScreenSize = (() => {
    const INITIAL_DIM = Dimensions.get('screen') || {};
    const DIM = { width: INITIAL_DIM.width || 0, height: INITIAL_DIM.height || 0 };

    Dimensions.addEventListener('change', ({ screen }) => {
        DIM.width = screen.width;
        DIM.height = screen.height;
    });

    return (key: 'width' | 'height') => {
        return DIM[key];
    };
})();