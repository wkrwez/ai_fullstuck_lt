import { View } from 'react-native';
import { saturateColor } from '@/src/utils/color';
import { RootWorldResponse } from '@/proto-registry/src/web/raccoon/query/query_pb';

export function WorldTopicBg({ info }: { info?: RootWorldResponse }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: info?.topic?.coverColor
          ? saturateColor(info.topic.coverColor)
          : '#222'
      }}
    ></View>
  );
}
