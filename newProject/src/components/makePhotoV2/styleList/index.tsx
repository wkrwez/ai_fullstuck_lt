import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, View, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown
} from 'react-native-reanimated';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useConfigStore } from '@/src/store/config';
import { useCreditStore } from '@/src/store/credit';
import { PageState } from '@/src/store/makePhotoV2';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { currentColors } from '@/src/theme';
import { $basicText, $flexCenter, $flexRow } from '@/src/theme/variable';
import { logWarn } from '@/src/utils/error-log';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { Checkbox } from '@Components/checkbox';
import { Image } from '@Components/image';
import { PrimaryBg } from '@Components/primaryBg';
import { Text } from '@Components/text';
import Button, { EButtonType } from '@Components/v2/button';
import { StyleSheet } from '@Utils/index';
import CreditCas, {
  CREDIT_TYPE,
  PLUS_BORDER_THEME1,
  PLUS_THEME1
} from '../../credit-cas';
import { showLoading } from '../../loading';
import { PrimaryButton } from '../../primaryButton';
import CreditWrapper from '../../v2/credit-wrapper';
import { PAGE_TOP, PANNEL_TOP } from '../constant';
import { strategyUpdateHandle } from '@/app/credit/error';
import {
  GameType,
  InvokeType
} from '@/proto-registry/src/web/raccoon/common/types_pb';
import { useShallow } from 'zustand/react/shallow';

const st = StyleSheet.create({
  $styleListWrap: {
    // backgroundColor: '#536073',
    paddingTop: 12,
    paddingLeft: 0,
    paddingBottom: 23,
    paddingRight: 0,
    borderRadius: 15
  },
  $styleListTitle: {
    paddingLeft: 24,
    marginBottom: 7,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '500'
  },
  $styleList: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row'
  },
  $styleItem: {
    width: 87,
    height: 113,
    marginRight: 3
  },
  $styleMask: {
    position: 'absolute',
    bottom: 1,
    left: 2,
    right: 1,
    height: 57,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8
  },
  $styleText: {
    position: 'absolute',
    bottom: 7,
    left: 0,
    right: 0,
    color: currentColors.white,
    lineHeight: 20,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center'
  },
  $styleCheckbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#121418'
  }
});

const $wrapStyle = StyleSheet.createRectStyle(
  {
    marginTop: PAGE_TOP,
    left: 9,
    right: 9,
    bottom: 40,
    height: 265
  },
  ['top', 'height']
);
interface StyleItemProps {
  id: string;
  source: string;
  text: string;
  checked: boolean;
  onPress: (v: string) => void;
  style?: ViewStyle;
}
const StyleItem = (props: StyleItemProps) => {
  return (
    <Pressable
      style={[st.$styleItem, props.style]}
      onPress={() => {
        props.onPress(props.id);
      }}
    >
      {props.checked && (
        <PrimaryBg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 10
          }}
        />
      )}

      <Image
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          right: 2,
          bottom: 2
        }}
        source={formatTosUrl(props.source, { size: 'size4' })}
      />
      <LinearGradient
        style={st.$styleMask}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={['#121418', 'rgba(0,0,0,0)']}
      />
      <Text style={st.$styleText}>{props.text}</Text>
      <Checkbox
        checked={props.checked}
        icon="checked"
        size={20}
        style={st.$styleCheckbox}
      />
    </Pressable>
  );
};

interface StyleListProps {
  //   value: string;
  //   onPress: (v: string) => void;
}

export const StyleList = (props: StyleListProps) => {
  const { pageState, style, setStyle, role2 } = useMakePhotoStoreV2(
    useShallow(state => ({
      pageState: state.pageState,
      style: state.style,
      setStyle: state.setStyle,
      role2: state.role2
    }))
  );

  const { styles } = useConfigStore(
    useShallow(state => ({
      styles: state.makePhoto?.styles
    }))
  );

  const currentStyles = useMemo(() => {
    if (role2) {
      // todo hack
      return styles?.filter(
        item =>
          item.id === 'original' || item.id === 'chibi' || item.id === 'cyber'
      );
    }
    return styles;
  }, [role2]);

  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);

  useEffect(() => {
    if (pageState === PageState.styleselect) {
      // 更新策略
      showLoading();
      strategyUpdateHandle(InvokeType.INVOKE_DRAWING_GEN);

      if (!styles) return;
      setStyle(style || styles[0].id);
      if (!currentStyles?.map(i => i.id).includes(style)) {
        setStyle(styles[0].id);
      }
    }
  }, [pageState, currentStyles]);

  const { consumption } = useCreditStore(
    useShallow(state => ({
      totalCredits: state.totalCredits,
      consumption: state.consumption
    }))
  );

  if (pageState !== PageState.styleselect) {
    return null;
  }
  return (
    styles && (
      <Animated.View
        entering={FadeInDown.damping(1000).duration(300)}
        exiting={FadeInUp.damping(1000).duration(300)}
        style={[
          $wrapStyle,
          {
            top:
              ($wrapStyle.top || 0) -
              Number($containerInsets.paddingBottom || 0),
            ...StyleSheet.columnStyle,
            justifyContent: 'space-between'
          }
        ]}
      >
        <View style={[st.$styleListWrap]}>
          <Text style={st.$styleListTitle}>#主图风格</Text>
          <ScrollView
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {currentStyles?.map((item, index) => (
              <StyleItem
                {...item}
                source={item.url}
                text={item.name}
                id={item.id}
                checked={style === item.key}
                onPress={setStyle}
                style={!index ? { marginLeft: 24 } : {}}
                // checked={props.value === item.key}
                // onPress={props.onPress}
              />
            ))}
          </ScrollView>
        </View>
        <View style={[StyleSheet.rowStyle, { justifyContent: 'center' }]}>
          {/* <PrimaryButton onPress={onPress}>生成照片</PrimaryButton> */}
          <CreditWrapper
            cornerText={consumption?.display}
            buttonContainer={
              <Button
                onPress={onPress}
                creditContainer={
                  consumption?.cost !== undefined ? (
                    <CreditCas
                      theme={CREDIT_TYPE.MINUS}
                      text={consumption?.cost + ''}
                      extraText={consumption?.originCost + ''}
                      size={20}
                      borderColors={['transparent', 'transparent']}
                      insetsColors={['transparent', 'transparent']}
                      isLinear={false}
                    ></CreditCas>
                  ) : (
                    <></>
                  )
                }
                type={EButtonType.LINEAR}
              >
                <Text
                  style={[
                    $basicText,
                    {
                      marginEnd: 10
                    }
                  ]}
                >
                  生成照片
                </Text>
              </Button>
            }
          ></CreditWrapper>
        </View>
      </Animated.View>
    )
  );

  async function onPress() {
    const { changePageState, takePhoto } = useMakePhotoStoreV2.getState();
    changePageState(PageState.effect);
    takePhoto({ invokeType: InvokeType.INVOKE_DRAWING_GEN });
  }
};
