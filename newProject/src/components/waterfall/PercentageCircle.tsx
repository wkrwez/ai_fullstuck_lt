// PercentageCircle.tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

interface IPercentageCircleProps {
  radius: number;
  percent: number;
  color?: string;
  bgcolor?: string;
  borderWidth?: number;
}

export default function PercentageCircle({
  radius,
  percent,
  color = 'rgba(0, 0, 0, 1)',
  bgcolor = 'transparent',
  borderWidth = 5
}: IPercentageCircleProps) {
  const width = radius * 2;
  const height = radius * 2 - 2;
  const circumference = Math.PI * width + Math.PI * height;
  const strokeDashoffset = circumference - (percent / 240) * circumference;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Ellipse
          cx={width / 2}
          cy={height / 2}
          rx={(width - borderWidth) / 2}
          ry={(height - borderWidth) / 2}
          stroke={color}
          strokeWidth={borderWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          // strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
