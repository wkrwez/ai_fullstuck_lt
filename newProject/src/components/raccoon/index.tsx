import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { DevSheet } from '@/src/components/dev/DevSheet';
import { useAppStore } from '@/src/store/app';
import { useStorageStore } from '@/src/store/storage';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { showToast } from '@Components/toast';
import {
  getSettingsPagePublicInfo,
  shouldEnableDevTools
} from '@step.ai/app-info-module';
import { useShallow } from 'zustand/react/shallow';

const RaccoonIcon = require('@Assets/image/feed/limao.png');

interface Props {
  style: StyleProp<ViewStyle>;
}

export const Raccoon = (props: Props) => {
  const [showDev, setShowDev] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { user } = useAppStore(
    useShallow(state => ({
      user: state.user
    }))
  );

  const showDevMenu = () => {
    // if (!shouldEnableDevTools()) return;
    setShowDev(true);
    useStorageStore.getState().__setStorage({ debugMode: true });
    showToast('debug模式已打开~');
  };

  const tripleInfoTap = Gesture.Tap()
    .numberOfTaps(8)
    .onEnd(() => {
      runOnJS(setShowInfo)(true);
    });
  const devMenuTap = Gesture.Tap()
    .numberOfTaps(16)
    .onEnd(() => {
      runOnJS(showDevMenu)();
    });

  const composed = Gesture.Exclusive(devMenuTap, tripleInfoTap);

  return (
    <>
      <GestureDetector gesture={composed}>
        <View style={props.style}>
          <Image
            source={RaccoonIcon}
            style={{ width: '100%', height: '100%' }}
          ></Image>
        </View>
      </GestureDetector>

      {showInfo && (
        <TouchableOpacity
          style={{
            alignItems: 'center',
            marginBottom: 20,
            justifyContent: 'center'
          }}
          onPress={async () => {
            await Clipboard.setStringAsync(
              getSettingsPagePublicInfo() + ` UID:${user?.uid}`
            );
            showToast('已复制信息至剪贴板');
            setShowInfo(false);
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#5d6b88',
              fontSize: 12
            }}
          >
            {getSettingsPagePublicInfo()}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#5d6b88',
              fontSize: 12
            }}
          >
            UID:{user?.uid}
          </Text>
        </TouchableOpacity>
      )}
      <DevSheet
        visible={showDev}
        onClose={() => {
          setShowDev(false);
        }}
      />
    </>
  );
};
