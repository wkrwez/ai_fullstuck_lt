import React, { ReactElement, ReactNode } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { EMPTY_WORK } from '@/src/constants';
import { colors, colorsUI } from '@/src/theme';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { Image } from '@Components/image';
import { StyleSheet } from '@Utils/StyleSheet';
import { Button } from '../button';
import { ImageStyle } from '../image';

export interface IEmptyPlaceHolder {
  children: ReactElement | Array<ReactElement> | string | ReactNode;
  style?: StyleProp<ViewStyle>;
  type?: keyof typeof EmptyState;
  button?: boolean;
  buttonStyle?: ViewStyle;
  buttonText?: string;
  onButtonPress?: () => void;
  theme?: Theme;
}

export const EmptyPlaceHolder = ({
  children,
  style,
  type = 'recommend', //默认
  button = false,
  buttonStyle,
  onButtonPress,
  buttonText,
  theme = Theme.LIGHT
}: IEmptyPlaceHolder) => {
  const themeConfig = getThemeColor(theme);
  return (
    <View style={[styles.emptyContainer, style]}>
      <Image source={EmptyState[type]} style={styles.emptyIcon as ImageStyle} />
      <View style={styles.emptyTextRow}>
        {typeof children === 'string' ? (
          <Text style={{ color: themeConfig.fontColor2 }}>{children}</Text>
        ) : (
          children
        )}
      </View>
      {button && (
        <Button onPress={onButtonPress} style={[styles.button, buttonStyle]}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Button>
      )}
    </View>
  );
};

export const EmptyWrapper = ({
  children,
  isEmpty,
  emptyText = '暂无数据',
  onCreate,
  style: $emptyWrapperStyleOverwrite,
  type = 'recommend' //默认
}: {
  children: ReactElement | Array<ReactElement> | string | ReactNode;
  isEmpty: boolean;
  onCreate?: () => void;
  emptyText?: string;
  style?: ViewStyle | ViewStyle[];
  type?: keyof typeof EmptyState;
}) => {
  return (
    <View style={[styles.$emptyWrapper, $emptyWrapperStyleOverwrite]}>
      {isEmpty ? (
        <View style={[styles.$emptyContent]}>
          <Image
            source={EmptyState[type]}
            style={styles.emptyIcon as ImageStyle}
          />
          <Text style={{ color: 'rgba(0,0,0,0.4)' }}>{emptyText}</Text>
          {onCreate && (
            <Pressable onPress={onCreate}>
              <View style={styles.$createBtn}>
                <Text style={styles.$createBtnText}>立即创作</Text>
              </View>
            </Pressable>
          )}
        </View>
      ) : (
        children
      )}
    </View>
  );
};

export const EmptyState = {
  userProduct: require('@Assets/empty/userProduct.png'), //个人作品
  userLike: require('@Assets/empty/userLike.png'), //个人    粉丝列表
  recommend: require('@Assets/empty/recommend.png'), //默认没有
  recommendDark: require('@Assets/empty/recommendDark.png'), //默认没有(dark模式)
  otherCancel: require('@Assets/empty/otherCancel.png'), //注销
  attentList: require('@Assets/empty/attentList.png'), //个人关注列表
  attent: require('@Assets/empty/attent.png'), //首页关注
  emptyBegging: require('@Assets/empty/empty-begging-illustration.png'),
  needlogin: EMPTY_WORK
};

const styles = StyleSheet.create({
  $emptyWrapper: {
    flex: 1
  },
  $createBtn: {
    backgroundColor: colors.palette.brand1,
    marginTop: 20,
    height: 36,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  $createBtnText: {
    color: StyleSheet.colors.white,
    fontSize: 13,
    fontFamily: 'PingFang SC',
    fontWeight: '500'
  },
  $emptyContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
    // borderColor: 'red',
    // borderWidth: 1
  },
  emptyContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyIcon: {
    width: 120,
    height: 120
  },
  emptyTextRow: {
    marginTop: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 112,
    height: 36,
    marginTop: 20,
    backgroundColor: '#FF6A3B',
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    height: 18
  }
});
