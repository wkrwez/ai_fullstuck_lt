import { View, ViewStyle } from 'react-native';
import { StyleSheet } from '@/src/utils';

interface PaginProps {
  style: ViewStyle;
  current: number;
  total: number;
}
// todo 暂时没做缩略态
export function Pagination(props: PaginProps) {
  //   if (props.total <= 5) {
  return (
    <View style={[StyleSheet.rowStyle, st.$wrap, props.style]}>
      {Array(props.total)
        .fill(0)
        .map((_, index) => (
          <View
            key={index}
            style=
            {[st.$item, 
              (index === props.current && st.$itemActive),
              // ((index === props.current - 1 || index === props.current + 1) && st.$itemActive0),
              // (index < props.current - 2 || index > props.current + 2) && st.$itemActive1
            ]}
          ></View>
        ))}
    </View>
  );
  //   }

  //   return Array(5).fill(2);
}

const st = StyleSheet.create({
  $wrap: {
    gap: 6,
    justifyContent: 'center'
  },
  $item: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E4E9',
    
  },
  $itemActive: {
    width: 6,
    height: 6,
    backgroundColor: StyleSheet.currentColors.brand1
  },
  $itemActive0: {
    width: 6,
    height: 6,
  }
  ,$itemActive1: {
    opacity: 0
  }
});
