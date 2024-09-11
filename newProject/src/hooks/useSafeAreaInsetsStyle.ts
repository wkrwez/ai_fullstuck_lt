import { FlexStyle, ViewStyle } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';

export type ExtendedEdge = Edge | 'start' | 'end';

const propertySuffixMap = {
  top: 'Top',
  bottom: 'Bottom',
  left: 'Start',
  right: 'End',
  start: 'Start',
  end: 'End'
};

const edgeInsetMap: { [key: string]: string } = {
  start: 'left',
  end: 'right'
};
export function useSafeAreaInsetsStyle(
  safeAreaEdges: ExtendedEdge[] = [],
  property: 'padding' | 'margin' = 'padding'
): Pick<
  FlexStyle,
  | 'marginBottom'
  | 'marginEnd'
  | 'marginStart'
  | 'marginTop'
  | 'paddingBottom'
  | 'paddingEnd'
  | 'paddingStart'
  | 'paddingTop'
> {
  const insets = useSafeAreaInsets();

  const ret = safeAreaEdges.reduce((acc, e) => {
    const key = edgeInsetMap[e] ?? e;
    const innerKey = key as keyof typeof insets;
    const value = insets[innerKey];

    return {
      ...acc,
      [`${property}${propertySuffixMap[e]}`]: value
    };
  }, {});

  return ret;
}

export function useSafeBottomArea() {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  return Math.max(Number($containerInsets.paddingBottom ?? 0), 30);
}
export function useSafeBottomAreaStyle() {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  return {
    padddingBottom: Math.max(Number($containerInsets.paddingBottom ?? 0), 30)
  } as ViewStyle;
}
