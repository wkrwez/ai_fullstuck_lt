import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { type IconProp, getProps } from './utils';

export function IconLoading(props: IconProp) {
  const rotateValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const spin = Animated.timing(rotateValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true
    });

    const loop = Animated.loop(spin);
    loop.start();

    return () => {
      loop.stop();
    };
  }, []);
  return (
    <Animated.View
      style={[
        {
          width: 13,
          height: 12,
          transform: [
            {
              rotate: rotateValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }
          ]
        }
      ]}
    >
      <Svg
        width="26"
        height="24"
        viewBox="0 0 26 24"
        fill="none"
        {...getProps(props)}
      >
        <Path
          opacity="0.5"
          d="M11.77 5.99902C12.2562 5.99902 12.657 6.39531 12.5859 6.87633C12.4277 7.94682 11.9819 8.96047 11.2885 9.80538C10.4078 10.8784 9.18239 11.6129 7.82093 11.8837C6.45947 12.1545 5.04623 11.9449 3.82201 11.2906C2.59779 10.6362 1.63833 9.57759 1.10711 8.29512C0.575899 7.01266 0.505795 5.58568 0.908748 4.25732C1.3117 2.92896 2.16278 1.78141 3.31697 1.01021C4.47116 0.239001 5.85705 -0.108146 7.23849 0.027915C8.32625 0.13505 9.35826 0.536555 10.2271 1.18162C10.6175 1.47148 10.6143 2.03511 10.2705 2.37895C9.92663 2.72278 9.37272 2.71335 8.96537 2.44781C8.39855 2.07832 7.74772 1.84747 7.0659 1.78031C6.08988 1.68418 5.11072 1.92945 4.29526 2.47432C3.4798 3.01919 2.8785 3.82996 2.5938 4.76847C2.30911 5.70698 2.35864 6.71518 2.73395 7.62127C3.10927 8.52735 3.78714 9.27528 4.65208 9.7376C5.51702 10.1999 6.5155 10.348 7.4774 10.1567C8.4393 9.96536 9.3051 9.44642 9.92728 8.68829C10.3619 8.15868 10.6589 7.53524 10.7984 6.87317C10.8987 6.39737 11.2837 5.99902 11.77 5.99902Z"
          fill="#CDEAFF"
        />
      </Svg>
    </Animated.View>
  );
}
