import { TouchableOpacity } from 'react-native';
import { Icon } from '@Components/icons';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { BlueLinear } from '../blueLinearBg';

interface RollButtonProps {
  loading?: boolean;
  text: string;
  onPress: () => void;
}
export function RollButton(props: RollButtonProps) {
  return (
    <TouchableOpacity
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        borderWidth: 1.3,
        overflow: 'hidden',
        borderColor: '#5DADEA',
        minWidth: 120
      }}
      onPress={props.onPress}
    >
      <BlueLinear dir="top" style={StyleSheet.absoluteFill} />
      {/* {loading} */}
      {props.loading ? (
        <>
          <Icon icon="makephoto_rolling" />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: 4,
              color: '#437397',
              fontWeight: '400',
              fontSize: 13,
              lineHeight: 34
            }}
          >
            小狸瞎编ing
          </Text>
        </>
      ) : (
        <>
          <Icon icon="makephoto_roll" />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: 4,
              color: '#437397',
              fontWeight: '400',
              fontSize: 13,
              lineHeight: 34
            }}
          >
            {props.text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
