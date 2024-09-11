import { useMemo } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { styles } from '@/src/utils';
import { Image } from '@Components/image';
import { turnLineSingle } from './const';
import st from './style';
import { StyleItem, TurnItem } from './types';

// const subRotateList = createStyleList();

export function TurnOptions(props: {
  rotateDeg: Animated.Value;
  list: TurnItem[];
  rotateList: StyleItem[];
  onSelect: (item: TurnItem, type: string) => void;
  type: string;
  radius: number;
  value?: string;
}) {
  // const [value, setValue] = useState<string>('');

  // const rotateList = useMemo(() => {
  //   return createStyleList(props.radius);
  // }, [props.radius]);

  const $itemStyle = useMemo(() => {
    return st.$optItemWrap(props.radius);
  }, [props.radius]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        st.$trunOptsWrap,
        {
          transform: [
            {
              rotate: props.rotateDeg.interpolate({
                inputRange: [-15, 90],
                outputRange: ['-15deg', '90deg']
              })
            }
          ]
        }
      ]}
    >
      <View>
        {props.list
          // .concat(props.list)
          // .concat(props.list)
          // .concat(props.list.slice(0, 2))
          .map((item, index) => {
            const styleItem = props.rotateList[index];
            return (
              <Pressable key={item.label} onPress={() => onSelectedItem(item)}>
                <View
                  style={styles($itemStyle, {
                    top: styleItem.top,
                    left: styleItem.left,
                    transform: `rotate(${styleItem.textDeg}deg)`
                  })}
                >
                  <Animated.Text
                    allowFontScaling={false}
                    style={[
                      st.$optionText,
                      st['$optionText_' + props.type],
                      props.value === item.id && st.$optionTextSelected
                    ]}
                  >
                    {item.label}
                  </Animated.Text>
                  <Image
                    style={[st.$optionLine, st['$optionLine_' + props.type]]}
                    source={turnLineSingle}
                  />
                  {/* <Image style={st.$optionSelected} source={TURN_ITEM_SELECTED} /> */}
                </View>
              </Pressable>
            );
          })}
      </View>
    </Animated.View>
  );

  function onSelectedItem(item: TurnItem) {
    props.onSelect(item, props.type);
    // setValue(item.label);
  }
}
