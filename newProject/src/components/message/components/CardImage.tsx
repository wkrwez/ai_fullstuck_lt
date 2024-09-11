import { Pressable, View } from 'react-native';
import { StyleSheet } from '@/src/utils';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { Image } from '@Components/image';
import { Text } from '@Components/text';

const DEFAULT_ATATAR = require('@Assets/image/message/card-right.png');

type CardImageProps = {
  source?: string;
};
export function CardImage(props: CardImageProps) {
  return (
    <Image
      source={props.source || DEFAULT_ATATAR}
      tosSize="size10"
      style={{ width: 46, height: 50, borderRadius: 4 }}
    ></Image>
  );
}
