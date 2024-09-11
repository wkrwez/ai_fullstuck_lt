import { useEffect } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { EnotiType, useStorageStore } from '@/src/store/storage';
import { reportClick, reportExpo } from '@/src/utils/report';
import { Image } from '@Components/image/index';
import { StyleSheet } from '@Utils/StyleSheet';
import { SheetModal } from '../../sheet';
import { registerNotification } from './register';

const NOTI_POSTER = require('@Assets/notification/noti-poster.png');

interface INotificationProps {
  visible: boolean;
  onClose: () => void;
  slogan: string;
  signal: EnotiType;
}

export default function Notification({
  visible,
  onClose,
  slogan,
  signal
}: INotificationProps) {
  const onSuccess = () => {
    registerNotification(onClose);
    reportClick('button', {
      module: 'push',
      push_scene: signal,
      push_button: 0
    });
  };

  useEffect(() => {
    if (visible) {
      reportExpo('all', { module: 'push', push_scene: signal });
    }
  }, [visible]);

  return (
    <SheetModal
      remainHeight={0}
      maskShown={true}
      isVisible={visible}
      maskOpacity={0.4}
      maskClosable={true}
      closeBtn={true}
      dragable={false}
      titleBarStyle={{ display: 'none' }}
      onClose={() => {
        onClose();
        reportClick('button', {
          module: 'push',
          push_scene: signal,
          push_button: 2
        });
      }}
    >
      <View style={[$wrapper]}>
        <View style={$top}>
          <Image
            contentFit="cover"
            source={NOTI_POSTER}
            style={{
              flex: 1
            }}
          ></Image>
        </View>
        <View style={$bottom}>
          <Text style={$title}>开启通知吧</Text>
          <Text style={$info}>{slogan}</Text>
          <View style={[$handle]}>
            <Pressable
              style={$closeNoti}
              onTouchStart={() => {
                onClose();
                reportClick('button', {
                  module: 'push',
                  push_scene: signal,
                  push_button: 1
                });
              }}
            >
              <Text style={$closeNotiText}>暂不开启</Text>
            </Pressable>
            <Pressable style={$openNoti} onTouchStart={onSuccess}>
              <LinearGradient
                colors={['#FF6A3B', '#FF8F50']}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 0.0 }}
                locations={[0.147, 0.9273]}
                style={$gradient}
              >
                <Text style={$openNotiText}>马上开启</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </SheetModal>
  );
}

const $wrapper: ViewStyle = {
  backgroundColor: StyleSheet.currentColors.white,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  overflow: 'hidden'
};

const $top: ViewStyle = {
  width: '100%',
  minHeight: 151,
  overflow: 'hidden',
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15
};

const $bottom: ViewStyle = {
  width: '100%',
  height: 151,
  paddingTop: 24,
  flexDirection: 'column',
  alignItems: 'center'
};

const $title: TextStyle = {
  color: '#222',
  fontSize: 18,
  fontWeight: '600',
  lineHeight: 24,
  fontFamily: 'PingFang SC'
};

const $info: TextStyle = {
  marginTop: 8,
  marginBottom: 24,
  fontSize: 14,
  lineHeight: 18,
  color: 'rgba(0, 0, 0, 0.54)',
  fontStyle: 'normal',
  fontFamily: 'PingFang SC',
  fontWeight: '400'
};

const $handle: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 44,
  width: '100%',
  flexDirection: 'row'
};

const $openNoti: ViewStyle = {
  width: 158,
  height: 44,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 21,
  overflow: 'hidden'
};

const $closeNoti: ViewStyle = {
  width: 158,
  height: 44,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 21,
  backgroundColor: '#FFF',
  marginRight: 13,
  borderWidth: 0.5,
  borderStyle: 'solid',
  borderColor: '#E8E8E8'
};

const $gradient: ViewStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const $openNotiText: TextStyle = {
  color: '#fff',
  fontFamily: 'PingFang SC',
  fontSize: 14,
  fontWeight: '600',
  lineHeight: 20,
  fontStyle: 'normal'
};

const $closeNotiText: TextStyle = {
  color: 'rgba(0, 0, 0, 0.54)',
  fontFamily: 'PingFang SC',
  fontSize: 14,
  lineHeight: 20,
  fontWeight: '500',
  fontStyle: 'normal'
};
