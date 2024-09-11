import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageStyle, TextStyle, View, ViewStyle } from 'react-native';
import { ICON_IMAGE } from '@/src/constants';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useAppStore } from '@/src/store/app';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { colors, colorsUI, spacing } from '@/src/theme';
import { Button } from '@Components/button';
import { Image } from '@Components/image';
import { SheetModal } from '@Components/sheet/SheetModal';
import { Text } from '@Components/text';
import { showToast } from '@Components/toast';
import { logWarn, requestErrorLog } from '@Utils/error-log';
import { STEPC_API_ENV, lipuAPIEnv } from '../../api/env';
import { CommonActions } from '@react-navigation/native';
import { APIEnvType, apiEnvTypeDesc } from '@step.ai/connect-api-common';
import { MenuItem } from './MenuItem';

interface DevSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const DevSheet = ({ visible, onClose }: DevSheetProps) => {
  const { env, setEnv } = useAppStore(state => ({ ...state }));
  const [selectEnv, setSelectEnv] = useState<APIEnvType>(env);
  const [loading, setLoading] = useState(false);

  const envTitle = (env: APIEnvType) => {
    const item = STEPC_API_ENV[env];
    if (!item) {
      return '';
    }
    const host = new URL(item.API).hostname;
    return `${apiEnvTypeDesc(env)}: ${host}`;
  };

  const envList = Object.keys(STEPC_API_ENV).map(key => {
    return {
      title: envTitle(key as APIEnvType),
      env: key as APIEnvType
    };
  });

  useEffect(() => {
    if (visible) setSelectEnv(env);
  }, [visible]);

  const user = useAppStore.getState().user;
  const signOff = useAppStore.getState().signOff;

  // 获取导航器的引用
  const navigation = useNavigation();
  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);

  const onLogOff = async () => {
    // 不需要登出
    try {
      await signOff().catch(e => {
        console.log('signOff', e);
        requestErrorLog('sign-off-error', e);
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'feed/index' }]
        })
      );
      return true;
    } catch (e) {
      // showToast('切换环境失败');
      return false;
    }
  };
  return (
    <SheetModal
      remainHeight={0}
      title={
        <View style={$titleStyle}>
          <Image style={$iconStyle} source={ICON_IMAGE}></Image>
          <Text preset="title" style={{ color: colors.palette.text }}>
            开发者面板
          </Text>
        </View>
      }
      maskClosable={false}
      isVisible={visible}
      onClose={onClose}
    >
      <View
        style={[{ padding: 30, paddingBottom: 0, backgroundColor: '#ffffff' }]}
      >
        {envList.map(item => {
          return (
            <MenuItem
              disabled={selectEnv === item.env}
              key={item.env}
              style={{ paddingVertical: spacing.sm }}
              title={item.title}
              selected={selectEnv === item.env}
              onPress={() => {
                setSelectEnv(item.env);
              }}
            />
          );
        })}
        <View>
          <View
            style={{
              flexDirection: 'row',
              padding: spacing.md,
              justifyContent: 'space-between'
            }}
          >
            <Button
              disabled={selectEnv === env}
              loading={loading}
              style={$submitBtnStyles}
              textStyle={$submitBtnTextStyle}
              onPress={async () => {
                setLoading(true);
                if (await onLogOff()) {
                  showToast('切换环境成功,如有问题请杀App后重启');
                  lipuAPIEnv.cleanUp();
                  setEnv(selectEnv);
                }
                setLoading(false);
                onClose();
              }}
            >
              切换环境
            </Button>
          </View>
        </View>
        {/* <View>
          <Button onPress={enableDouble}>开启双人捏图</Button>
        </View> */}
      </View>
    </SheetModal>
  );

  function enableDouble() {
    useMakePhotoStoreV2.getState().enableDouble();
    showToast('双人捏图已开启~');
  }
};

const $titleStyle: ViewStyle = {
  flexDirection: 'row'
};

const $iconStyle: ImageStyle = {
  marginRight: spacing.sm,
  borderRadius: spacing.xs,
  width: 32,
  height: 32
};

const $submitBtnStyles: ViewStyle = {
  backgroundColor: colorsUI.Card.brand.default,
  flex: 1,
  marginHorizontal: spacing.xs
};

const $submitBtnTextStyle: TextStyle = {
  color: colorsUI.Text.default.inverse,
  fontSize: 15,
  fontStyle: 'normal',
  fontWeight: '500',
  lineHeight: 26
};
