import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { router, useNavigation } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  RotateInDownLeft
} from 'react-native-reanimated';
import { DEFAULT_MODAL_ZINDEX, LOGIN_SCENE } from '@/src/constants';
import { useSafeBottomArea } from '@/src/hooks';
import { useAppStore } from '@/src/store/app';
import { SwitchName, useControlStore } from '@/src/store/control';
import { usePublishStore } from '@/src/store/publish';
import { hex, typography } from '@/src/theme';
import { CommonColor } from '@/src/theme/colors/common';
import { StyleSheet } from '@/src/utils';
import { Source, reportClick, reportExpo } from '@/src/utils/report';
import { useAuthState } from '../../hooks/useAuthState';
import { useMakePhotoStoreV2 } from '../../store/makePhotoV2';
import { Icon } from '../icons';
import Affix from '../v2/affix';
import { useShallow } from 'zustand/react/shallow';
import { Top3HistoryImage } from './Top3HistoryImage';

const AFFIX_POSITION = [0, 18, 83, 0];

interface EntryConfig {
  title: string;
  desc: string;
  icon: React.ReactNode;
  onPress: () => void;
  visible: boolean;
  bgColor: string;
}

export function PublishEntry({
  expandFlag = ''
}: {
  expandFlag: string | string[];
}) {
  const loginIntercept = useAuthState().loginIntercept;
  const [visible, setVisible] = useState(false);
  const albumHasImage = useRef<boolean>(false);
  const user = useAppStore(state => state.user);
  const navigation = useNavigation();

  const switchConfig = useControlStore(
    useShallow(state => {
      const checkIsOpen = state.checkIsOpen;
      return {
        [SwitchName.DISABLE_ENTRY_PARREL_WORLD]: checkIsOpen(
          SwitchName.DISABLE_ENTRY_PARREL_WORLD
        ),
        [SwitchName.DISABLE_ENTRY_PUBLISH]: checkIsOpen(
          SwitchName.DISABLE_ENTRY_PUBLISH
        )
      };
    })
  );

  const bottom = useSafeBottomArea();
  const entries: EntryConfig[] = [
    {
      title: '炖图',
      desc: '创造你的所爱',
      icon: <Icon icon="drawing_entry_icon" size={60} />,
      onPress: gotoDrawingPage,
      visible: true,
      bgColor: 'rgba(255, 234, 212, 1)'
    },
    {
      title: '平行世界',
      desc: '再也没有意难平',
      icon: <Icon icon="world_entry_icon" size={60} />,
      onPress: gotoWorldCenter,
      visible: !switchConfig[SwitchName.DISABLE_ENTRY_PARREL_WORLD],
      bgColor: 'rgba(200, 238, 255, 1)'
    },
    {
      title: '无限乱斗',
      desc: '高燃卡牌游戏',
      icon: <Icon icon="fight_entry_icon" size={60} />,
      onPress: gotoFight,
      visible: false,
      bgColor: 'rgba(255, 229, 231, 1)'
    },
    {
      title: '发布',
      desc: '去选择一张你想发布的照片吧',
      icon: (
        <Top3HistoryImage
          onImageReady={hasImage => (albumHasImage.current = hasImage)}
        />
      ),
      onPress: gotoPublishPage,
      visible: !switchConfig[SwitchName.DISABLE_ENTRY_PUBLISH],
      bgColor: 'rgba(247, 247, 247, 1)'
    }
  ];
  const visibleEntries = entries.filter(item => item.visible);
  const fadeInAnimation = visibleEntries.map((_, index) =>
    FadeInDown.delay(100)
      .easing(Easing.elastic(1))
      .withInitialValues({
        transform: [{ translateY: (index + 1) * 50 }, { scaleY: 1.2 }]
      })
  );

  const onClick = useCallback(() => {
    Haptics.notificationAsync();
    loginIntercept(
      () => {
        setVisible(true);
      },
      { scene: LOGIN_SCENE.TO_CREATE }
    );
  }, [loginIntercept]);

  useEffect(() => {
    if (expandFlag) {
      onClick();
    }
  }, [expandFlag]);

  const onClose = () => {
    reportClick('playentry_close_button');
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      // 刷新狸史相册中前三张图片
      usePublishStore.getState().getAlbumPhotos(true, true);
    }
  }, [user, visible]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 刷新狸史相册中前三张图片
      usePublishStore.getState().getAlbumPhotos(true, true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (visible) {
      reportExpo('playentry_page_expo');
    }
  }, [visible]);

  return (
    <>
      <Affix position={AFFIX_POSITION} touchEndHandler={onClick}></Affix>
      {visible ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { zIndex: DEFAULT_MODAL_ZINDEX },
            StyleSheet.centerStyle,
            $modalbodyContainer
          ]}
        >
          <Animated.View
            style={StyleSheet.absoluteFill}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <LinearGradient
              style={[
                StyleSheet.absoluteFill,
                {
                  height: '100%',
                  width: '100%'
                }
              ]}
              colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 1)']}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>

          <Pressable style={$blurContainer}>
            <BlurView intensity={50} style={$blurContainer}>
              <View style={[$entriesContainer, { paddingBottom: bottom }]}>
                {visibleEntries.map((item, index) => (
                  <Animated.View
                    key={item.title}
                    entering={fadeInAnimation[index]}
                    exiting={FadeOutDown}
                  >
                    <Pressable
                      style={[
                        $entryContainer,
                        {
                          backgroundColor: item.bgColor
                        }
                      ]}
                      onPress={() => {
                        setVisible(false);
                        item.onPress();
                      }}
                    >
                      {item.icon}
                      <View style={$entryTextContainer}>
                        <Text style={$entryTitle}>{item.title}</Text>
                        <Text style={$entryDesc}>{item.desc}</Text>
                      </View>
                      <Icon icon="arrow_icon" size={16} />
                    </Pressable>
                  </Animated.View>
                ))}
                {visible ? (
                  <Pressable onPress={onClose}>
                    <Animated.View
                      entering={RotateInDownLeft.delay(100)}
                      exiting={FadeOutDown}
                      style={[$closeBtn]}
                    >
                      <Icon
                        color={CommonColor.black1}
                        icon="close_outline"
                        size={18}
                      />
                    </Animated.View>
                  </Pressable>
                ) : null}
              </View>
            </BlurView>
          </Pressable>
        </View>
      ) : null}
    </>
  );

  function gotoDrawingPage() {
    useMakePhotoStoreV2.getState().reset();
    reportClick('playentry_image_button', {
      albumstatus: albumHasImage.current ? '1' : '0'
    });
    router.push({
      pathname: '/make-photo/',
      params: {
        from: Source.HOME_ENTRY
      }
    });
  }

  function gotoWorldCenter() {
    reportClick('playentry_world_button');
    router.push({
      pathname: '/parallel-world/center'
    });
  }

  function gotoFight() {
    // reportClick('world_button');
  }

  function gotoPublishPage() {
    reportClick('playentry_picture_button', {
      albumstatus: albumHasImage.current ? '1' : '0'
    });

    router.push({
      pathname: '/publish/',
      params: {
        lishi: 1
      }
    });
  }
}

const $modalbodyContainer: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 'auto',
  height: 'auto',
  backgroundColor: 'transparent',
  padding: 0,
  paddingBottom: 0
};

const $blurContainer: ViewStyle = {
  width: '100%',
  height: '100%'
};

const $entriesContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: '100%',
  marginHorizontal: 10
};

const $entryContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: 82,
  paddingVertical: 11,
  paddingLeft: 10,
  paddingRight: 24,
  backgroundColor: CommonColor.gray1,
  borderRadius: 12,
  marginBottom: 10,
  width: '100%'
};

const $entryTextContainer: ViewStyle = {
  flex: 1,
  marginLeft: 6,
  marginRight: 18
};

const $entryTitle: TextStyle = {
  color: CommonColor.title,
  fontSize: 18,
  lineHeight: 25,
  fontFamily: typography.fonts.baba.bold
};

const $entryDesc: TextStyle = {
  color: CommonColor.black40,
  fontSize: 14,
  lineHeight: 20,
  marginTop: 3
};

const $closeBtn: ViewStyle = {
  width: 50,
  height: 50,
  padding: 15,
  borderRadius: 50,
  borderWidth: 0.5,
  borderColor: hex(CommonColor.black, 0.18),
  marginBottom: 30,
  marginTop: 20
};
