import { router } from 'expo-router';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { hideToast } from '@/src/components';
import { useStorageStore } from '@/src/store/storage';

interface IToastInnerProps {
  localRewardToast?: string;
  localPoints?: number;
  diyText?: string;
  diyLinkText?: string;
}

export default function ToastInner({
  localRewardToast = '',
  localPoints = 0,
  diyText = '',
  diyLinkText = ''
}: IToastInnerProps) {
  const huaweiToLink = (e: GestureResponderEvent) => {
    const isHuaweiDevice = useStorageStore.getState().device === 'HUAWEI';
    if (isHuaweiDevice) {
      router.push({
        pathname: '/credit/' as RelativePathString
      });
      hideToast();
    }
  };

  const toLink = (e: GestureResponderEvent) => {
    router.push({
      pathname: '/credit/' as RelativePathString
    });
    hideToast();
  };

  return (
    <Pressable onPressIn={huaweiToLink}>
      <View
        style={{
          flexDirection: 'row',
          pointerEvents: 'auto'
        }}
      >
        <Text style={{ color: '#fff' }}>
          {!diyText
            ? `${localRewardToast}，送你+${localPoints}狸电池！`
            : diyText}
        </Text>
        <Pressable onPressIn={toLink} style={{ pointerEvents: 'auto' }}>
          <Text style={{ color: '#7FD9FF' }}>
            {!diyLinkText ? '去看看>>' : diyLinkText}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
