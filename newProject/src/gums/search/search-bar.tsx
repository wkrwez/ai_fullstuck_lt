import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  GestureResponderEvent,
  Keyboard,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Icon, IconTypes } from '@/src/components';
import { useSearchStore } from '@/src/store/search';
import { typography } from '@/src/theme';
import {
  $SEARCH_COLORS,
  $USE_FONT,
  $Z_INDEXES,
  $flex,
  $flexHBetween,
  $flexHCenter,
  $flexHStart
} from '@/src/theme/variable';
import { dp2px } from '@/src/utils';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface ISearchBarProps {
  placeLoop?: boolean;
  placeTexts?: string[];
  placeHolderContent?: string;
  loopGap?: number;
  autoFocus?: boolean;
  value?: string;
  searchIcon?: string;
  verticalSlide?: boolean;
  onSearch?: (
    e:
      | GestureResponderEvent
      | NativeSyntheticEvent<TextInputSubmitEditingEventData>,
    keywords: string
  ) => void;
  onFocus?: (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
    keywords: string
  ) => void;
  onBlur?: (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
    keywords: string
  ) => void;
  onParentFocus?: (e: GestureResponderEvent, keywords: string) => void;
  hiddenRight?: boolean;
  hiddenBack?: boolean;
  $customStyle?: ViewStyle;
  onChange?: (v: string) => void;
  onSelect?: (e: GestureResponderEvent, keywords: string) => void;
  canbeEdit?: boolean;
  clearWord?: () => void;
  ellipseMode?: boolean;
  ellipseWidth?: number;
}

export default function SearchBar({
  placeLoop = false,
  placeTexts = [],
  placeHolderContent = '',
  loopGap = 3000,
  autoFocus = false,
  value = '',
  onSearch,
  onFocus,
  onBlur,
  onParentFocus,
  hiddenRight = false,
  hiddenBack = false,
  $customStyle,
  onChange,
  searchIcon = 'search_gray',
  onSelect,
  canbeEdit = true,
  clearWord,
  ellipseMode = false,
  ellipseWidth,
  verticalSlide = false
}: ISearchBarProps) {
  useEffect(() => {
    let timer = undefined;
    let index = 1;
    if (placeLoop && placeTexts?.length) {
      setPlaceContent(placeTexts[0]);
      timer = setInterval(() => {
        const realIndex = index % placeTexts?.length;
        setPlaceContent(placeTexts[realIndex]);

        if (realIndex === 0) {
          verticalSlideOffset.value = withSequence(
            withTiming(-36 * placeTexts.length, {
              duration: 300
            }),
            withTiming(0, {
              duration: 0
            })
          );
        } else {
          verticalSlideOffset.value = withTiming(-36 * realIndex, {
            duration: 300
          });
        }

        index++;
      }, loopGap);
    }
    return () => {
      clearInterval(timer);
    };
  }, [placeLoop, placeTexts]);

  const [placeContent, setPlaceContent] = useState('');

  useEffect(() => {
    setPlaceContent(placeHolderContent);
  }, [placeHolderContent]);

  const [keywords, setKeywords] = useState('');

  const searchInputWidth = useSharedValue(dp2px(279));
  const pressOpacity = useSharedValue(1);

  useEffect(() => {
    if (hiddenRight) {
      searchInputWidth.value = withTiming(dp2px(325), {
        duration: 300
      });
    } else {
      searchInputWidth.value = withTiming(dp2px(271), {
        duration: 300
      });
    }
  }, [hiddenRight]);

  const $searchInputAnime = useAnimatedStyle(() => ({
    width: searchInputWidth.value,
    opacity: pressOpacity.value
  }));

  const ellipseModeOpacity = useSharedValue(0);
  const $ellipseModeAnime = useAnimatedStyle(() => ({
    opacity: ellipseModeOpacity.value
  }));

  useEffect(() => {
    ellipseModeOpacity.value = withTiming(1, {
      duration: 300
    });
  }, [ellipseMode]);

  useEffect(() => {
    setKeywords(value);
  }, [value]);

  const clearInput = (e: GestureResponderEvent) => {
    setKeywords('');
    clearWord?.();
  };

  const verticalSlideOffset = useSharedValue(0);

  const $verticalSlideAnimate = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: verticalSlideOffset.value
      }
    ]
  }));
  const updateMaxLimit = (e: LayoutChangeEvent) => {};

  const [beFocus, setBeFocus] = useState(false);

  useEffect(() => {
    if (beFocus) {
      ellipseModeOpacity.value = 0;
    } else {
      ellipseModeOpacity.value = 1;
    }
  }, [beFocus]);

  return (
    <View style={[$searchArea, $flexHStart]}>
      <Pressable
        onPressIn={(e: GestureResponderEvent) => {
          onParentFocus?.(e, keywords || placeContent);
        }}
        style={$flexHCenter}
      >
        <Icon
          size={24}
          icon="back"
          onPress={() => {
            if (!hiddenBack) {
              // Keyboard.dismiss();
              router.back();
            }
          }}
          style={{
            opacity: hiddenBack ? 0 : 1
          }}
        ></Icon>
        <Animated.View style={[$searchInputAnime]}>
          <View style={[$flexHCenter, $searchWrapper, $customStyle]}>
            {keywords && (
              <Icon
                size={16}
                icon="search_clear"
                containerStyle={{
                  position: 'absolute',
                  right: 10,
                  zIndex: $Z_INDEXES.z1000
                }}
                onPress={clearInput}
              />
            )}
            {searchIcon ? (
              <Icon
                size={16}
                icon={searchIcon as IconTypes}
                containerStyle={{
                  position: 'absolute',
                  left: 12,
                  zIndex: $Z_INDEXES.z1000
                }}
              />
            ) : (
              <></>
            )}
            <TextInput
              allowFontScaling={false}
              placeholder={
                verticalSlide
                  ? ''
                  : placeContent ||
                    useSearchStore.getState().lastPlaceText ||
                    '搜索你喜爱的内容吧～'
              }
              autoFocus={autoFocus}
              numberOfLines={2}
              style={[
                $input,
                {
                  pointerEvents: canbeEdit ? 'auto' : 'none',
                  opacity: ellipseMode || !beFocus ? 0 : 1
                }
              ]}
              maxLength={100}
              selectionColor={$SEARCH_COLORS.main}
              placeholderTextColor={$SEARCH_COLORS.black_30}
              cursorColor={$SEARCH_COLORS.main}
              value={keywords}
              onChangeText={v => {
                setKeywords(v);
                onChange?.(v);
              }}
              onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                setBeFocus(true);
                onFocus?.(e, keywords || placeContent);
              }}
              onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                setBeFocus(false);
                onBlur?.(e, keywords || placeContent);
              }}
              onTouchStart={(e: GestureResponderEvent) =>
                onSelect?.(e, keywords || placeContent)
              }
              onSubmitEditing={e => onSearch?.(e, keywords || placeContent)}
              onLayout={updateMaxLimit}
              editable={canbeEdit}
            ></TextInput>
            {verticalSlide ? (
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    left: dp2px(13),
                    top: dp2px(9)
                  },
                  $verticalSlideAnimate
                ]}
              >
                {[...placeTexts, placeTexts[0]].map((pt, ptIndex) => {
                  return (
                    <Text
                      key={ptIndex}
                      style={[
                        $input,
                        {
                          color: $SEARCH_COLORS.black_30
                        }
                      ]}
                    >
                      {pt}
                    </Text>
                  );
                })}
              </Animated.View>
            ) : null}
            {(ellipseMode || !beFocus) && !verticalSlide ? (
              <Animated.View
                style={[
                  $input,
                  {
                    position: 'absolute',
                    width: ellipseWidth,
                    pointerEvents: 'none'
                  },
                  $ellipseModeAnime
                ]}
              >
                <Text
                  style={[
                    $input,
                    {
                      top: dp2px(9),
                      left: dp2px(-3),
                      marginLeft: dp2px(16),
                      color:
                        ellipseMode || (!ellipseMode && beFocus)
                          ? $SEARCH_COLORS.black_87
                          : $SEARCH_COLORS.black_30
                    }
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {keywords ||
                    placeContent ||
                    useSearchStore.getState().lastPlaceText ||
                    '搜索你喜爱的内容吧～'}
                </Text>
              </Animated.View>
            ) : null}
          </View>
        </Animated.View>

        {!hiddenRight ? (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={e => {
              if (keywords || placeContent) {
                Haptics.impactAsync();
                Keyboard.dismiss();
                onSearch?.(e, keywords || placeContent);
              }
            }}
          >
            <Text
              style={[
                $searchButton,
                {
                  color:
                    keywords || placeContent
                      ? $SEARCH_COLORS.main
                      : $SEARCH_COLORS.black_25
                }
              ]}
            >
              搜索
            </Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </Pressable>
    </View>
  );
}

const $searchArea: ViewStyle = {
  ...$flexHStart,
  height: 54,
  paddingLeft: 12,
  paddingEnd: 16
};

const $searchButton: TextStyle = {
  ...$USE_FONT(
    $SEARCH_COLORS.main,
    typography.fonts.pingfangSC.normal,
    15,
    'normal',
    '500',
    18
  ),
  marginLeft: 16
};

const $input: ViewStyle & TextStyle = {
  flex: 1,
  height: 36,
  marginLeft: 18,
  flexDirection: 'row',
  ...$USE_FONT(
    $SEARCH_COLORS.black_87,
    typography.fonts.pingfangSC.normal,
    13,
    'normal',
    '500',
    18
  )
};

const $searchWrapper: ViewStyle = {
  paddingLeft: 14,
  paddingRight: 32,
  marginLeft: 14,
  borderRadius: 100,
  backgroundColor: $SEARCH_COLORS.searchBg,
  position: 'relative',
  overflow: 'hidden'
};
