import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  ImageStyle,
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { ESearchResourceType, getQuerySourceByType } from '@/src/api/search';
import { LOGIN_SCENE } from '@/src/constants';
import SearchBar from '@/src/gums/search/search-bar';
import { useAuthState } from '@/src/hooks/useAuthState';
import { useAppStore } from '@/src/store/app';
import { useBrandStore } from '@/src/store/brand';
import { SwitchName, useControlStore } from '@/src/store/control';
import { useMessageStore } from '@/src/store/message';
import { useSearchStore } from '@/src/store/search';
import { useUserInfoStore } from '@/src/store/userInfo';
import {
  $Z_INDEXES,
  $flexHBetween,
  $flexRow,
  $relative
} from '@/src/theme/variable';
import { dp2px, isIos } from '@/src/utils';
import { logWarn } from '@/src/utils/error-log';
import { reportClick } from '@/src/utils/report';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { getScreenSize } from '@Utils/getScreenSize';
import { usePanGestureStore } from '../states';
import { useShallow } from 'zustand/react/shallow';

const CommentIcon = require('@Assets/image/feed/comment.png');
const MineIcon = require('@Assets/image/feed/mine.png');

const windowWidth = getScreenSize('width');

export default function SearchArea() {
  const { loginIntercept } = useAuthState();
  const { messageCount } = useMessageStore(
    useShallow(state => ({
      messageCount: state.count
    }))
  );

  const slideTop = usePanGestureStore(state => state.slideTop);

  const inputFlexValue = useSharedValue(0);

  const { hideSearchIcon } = useControlStore(
    useShallow(state => ({
      hideSearchIcon: state.checkIsOpen(SwitchName.DISABLE_SEARCH_ENREY)
    }))
  );

  useEffect(() => {
    const easeEffect = {
      duration: 300,
      easing: Easing.out(Easing.ease)
    };
    if (slideTop) {
      inputFlexValue.value = withTiming(0, easeEffect);
    } else {
      inputFlexValue.value = withTiming(1, easeEffect);
    }
  }, [slideTop]);

  const onFocus = (e: GestureResponderEvent, keywords: string) => {
    Haptics.impactAsync();

    reportClick('search_entry');
    useSearchStore.getState().updateLastPlaceText(keywords);

    router.push({
      pathname: '/search' as RelativePathString
    });
  };

  const { placeTexts } = useSearchStore(
    useShallow(state => ({
      placeTexts: state.initPlaceTexts
    }))
  );

  return (
    <View id="feed-search-area" style={$searchArea}>
      {hideSearchIcon ? (
        <View style={{ width: dp2px(226) }}></View>
      ) : (
        <Animated.View style={[{ flex: 1 }]}>
          <KeyboardAvoidingView behavior={isIos ? 'height' : undefined}>
            <SearchBar
              placeLoop={true}
              searchIcon="search_origin"
              placeTexts={placeTexts}
              hiddenRight
              hiddenBack
              $customStyle={{
                width: dp2px(226),
                backgroundColor: '#2222220d'
              }}
              autoFocus={false}
              onParentFocus={onFocus}
              canbeEdit={false}
              verticalSlide={placeTexts?.length > 1}
            ></SearchBar>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
      <View style={[$flexRow, $commentPerson]}>
        <TouchableOpacity
          onPress={() => {
            loginIntercept(
              () => {
                reportClick('message_button', {
                  status: messageCount > 0 ? '0' : '1'
                });
                router.push('/message/');
              },
              { scene: LOGIN_SCENE.TO_MESSAGE }
            );
          }}
        >
          <View style={[$commentIcon, $relative]}>
            <Image source={CommentIcon} style={$comment}></Image>
            {messageCount ? (
              <View style={$commentUpdate}>
                <Text style={$commentNumber}>
                  {messageCount > 99 ? '99+' : messageCount}
                </Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={gotoUser}>
          <View style={$commentIcon}>
            <Image source={MineIcon} style={$person}></Image>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  function gotoUser() {
    reportClick('user_button');
    loginIntercept(
      () => {
        const id = useAppStore.getState().user?.uid;
        // useProfileStore.getState().request(id || '');
        useUserInfoStore.getState().syncUserInfo(id || '');
        router.push({
          pathname: `/user/${(id || '').toString()}`,
          params: {
            id: (useAppStore.getState().user?.uid || '').toString()
          }
        });
      },
      { scene: LOGIN_SCENE.TO_USER }
    );
  }
}

const $searchArea: ViewStyle = {
  ...$flexHBetween,
  height: 30,
  marginTop: 8,
  width: windowWidth
};

const $commentPerson: ViewStyle = {
  width: 72,
  height: 40,
  marginRight: 12
};

const $comment: ImageStyle = {
  borderRadius: 10,
  width: 26,
  height: 26,
  zIndex: $Z_INDEXES.z2
};

const $commentIcon: ViewStyle = {
  width: 44,
  height: 40,
  justifyContent: 'center'
};

const $commentUpdate: ViewStyle = {
  position: 'absolute',
  left: 16,
  top: 1,
  height: 16,
  paddingLeft: 5,
  paddingRight: 5,
  borderRadius: 50,
  backgroundColor: '#FD4C29',
  zIndex: 99
};

const $commentNumber: TextStyle = {
  fontWeight: '600',
  lineHeight: 16,
  fontSize: 10,
  color: StyleSheet.currentColors.white
};

const $person: ImageStyle = {
  borderRadius: 10,
  width: 26,
  height: 26
};
