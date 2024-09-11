import { useMemoizedFn } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageStyle,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  NativeSyntheticEvent,
  Platform,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
  unstable_batchedUpdates
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReAnimated, {
  FadeIn,
  FadeInDown,
  opacity,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {
  LocalToast,
  hideLoading,
  showToast as showGlobalToast,
  showLoading
} from '@/src/components';
import Notification from '@/src/components/v2/notification';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { useAppStore } from '@/src/store/app';
import { useBehaviorStore } from '@/src/store/behavior';
import { useDetailStore } from '@/src/store/detail';
import { EnotiType, useStorageStore } from '@/src/store/storage';
import { hex } from '@/src/theme';
import { darkSceneColor, lightSceneColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { getScreenSize, isIos } from '@/src/utils';
import { getPageName, reportClick, setPageName } from '@/src/utils/report';
import { safeParseJson } from '@/src/utils/safeParseJson';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { StyleSheet } from '@Utils/StyleSheet';
import { TouchableScale } from '../TouchableScale';
import { Avatar } from '../avatar';
import { Bubble } from '../bubble';
import { EmojiInputIcon } from '../emoji/EmojiInputIcon';
import { CustomKeyboard } from '../emoji/customKeyboard';
import { useEmojiKeyboard } from '../emoji/customKeyboard/emoji-keyboard.hook';
import SelectedEmojiBar from '../emoji/customKeyboard/selected-emoji-bar';
import { useLocalToast } from '../toast/useLocalToast';
import useNotification from '../v2/notification/hook';
import { useShallow } from 'zustand/react/shallow';
import { CommentEvent, CommentEventBus } from './eventbus';
import { InputType, ReplyParamsType } from './typing';

const ICON_li = require('@Assets/image/comment/li1.png');
const ICON_li2 = require('@Assets/image/comment/li2.png');

const MAX_INPUT_LENGTH = 500;
const ERR_LEGAL_RISK = 10005;
const MAX_EMOJI_TIP_SHOW_COUNT = 5;

export const CommentInput = ({
  detailId = '',
  theme = Theme.LIGHT,
  showDisplayInput = true
}: {
  detailId?: string;
  theme?: Theme;
  showDisplayInput?: boolean;
}) => {
  const themeConfig = theme === Theme.LIGHT ? lightSceneColor : darkSceneColor;
  const $container = {
    backgroundColor: themeConfig.bg2
  };

  const { insertComment } = useDetailStore(
    useShallow(state => ({
      insertComment: state.insertComment
    }))
  );

  const [editing, setEditing] = useState<boolean>(false);
  //  保证在 input 回调事件中可以访问到最新的数值
  const editingRef = useRef<boolean>(false);
  editingRef.current = editing;

  const { user } = useAppStore(
    useShallow(state => ({
      user: state.user
    }))
  );
  const { loginIntercept } = useAuthState();

  const inputRef = useRef<TextInput>(null);
  // 记录键盘展开状态
  const isKeyboardShowing = useRef(false);
  const [text, setText] = useState('');
  const [keyboardHeight, setKeyBoardHeight] = useState(0); // 键盘高度

  const [inputTip, setInputTip] = useState<string | undefined>();
  const liHelperDisplayCountRef = useRef<number>(MAX_EMOJI_TIP_SHOW_COUNT + 1);

  const [inputParams, setInputParams] = useState<ReplyParamsType>({});

  const closeCommentInput = useMemoizedFn(() => {
    setEditing(false);
    setIsEmojiKeyboardVisible(false);
  });

  const { showToast, hideToast, ...restToastProps } = useLocalToast();

  // 唤起输入框
  const startEdit = useMemoizedFn(
    (
      params?: ReplyParamsType & {
        type?: InputType;
      }
    ) => {
      const {
        type,
        parentCommentId,
        repliedCommentId,
        repliedCommentName,
        detailId: inputDetailId
      } = params || {};

      console.log('===lin startEdit', getPageName());

      loginIntercept(
        async () => {
          unstable_batchedUpdates(() => {
            setEditing(true);
            setInputParams(prev => ({
              detailId: inputDetailId ?? detailId,
              parentCommentId: parentCommentId ?? prev.parentCommentId,
              repliedCommentId: repliedCommentId ?? prev.repliedCommentId,
              repliedCommentName: repliedCommentName ?? prev.repliedCommentName
            }));
            if (type === InputType.EMOJI) {
              reportClick('emoji_collection_load');
            }
            setIsEmojiKeyboardVisible(prev =>
              type === InputType.TEXT
                ? false
                : type === InputType.EMOJI
                  ? true
                  : prev
            );
          });
        },
        { scene: LOGIN_SCENE.COMMENT }
      );
    }
  );

  const updateEmojiTipCount = useMemoizedFn((count?: number) => {
    if (user?.uid) {
      useStorageStore
        .getState()
        .updateJsonRecord('emojiInputTipRecord', record => {
          const prev =
            typeof record[user.uid] === 'number'
              ? (record[user.uid] as number)
              : 0;

          record[user.uid] = count || prev + 1;
          liHelperDisplayCountRef.current = count || prev + 1;
          return record;
        });

      if (liHelperDisplayCountRef.current > MAX_EMOJI_TIP_SHOW_COUNT) {
        setInputTip(undefined);
      }
    }
  });

  const onShowInput = useMemoizedFn(() => {
    if (Platform.OS === 'android') {
      if (!isKeyboardShowing.current) {
        // 安卓有概率唤醒不了键盘 tricky 解法
        inputRef.current?.blur();
      }

      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      return () => {
        clearTimeout(timer);
      };
    } else {
      inputRef.current?.focus();
    }
  });

  const onFocus = () => {
    isKeyboardShowing.current = true;
    switchOnKeyboard();
  };

  const onBlur = () => {
    isKeyboardShowing.current = false;
  };

  const onChangeText = (currentText: string) => {
    if (editingRef.current) {
      setText(currentText);
    }
  };

  const onSubmit = () => {
    // 强通知逻辑
    setInitLock(false);

    showLoading();
    // todo@linyueqiang 看看有没有其它解法，输入框在发送成功后关闭比较好
    // 如果不在发送前隐藏，输入框会闪动
    setEditing(false);
    editingRef.current = false;

    const submit = async () => {
      try {
        const emojiInfo = selectedEmojis?.[0];

        if (emojiInfo) {
          reportClick('send_emoji_button');
        }

        const resp = await insertComment(inputParams.detailId || detailId, {
          emojiInfo,
          commentGroupId: inputParams.detailId || detailId,
          content: text,
          parentCommentId: inputParams.parentCommentId,
          repliedCommentId: inputParams.repliedCommentId
        });

        setText('');
        clearSelectEmoji();
        hideLoading();
        showGlobalToast('评论成功');
        if (emojiInfo) {
          updateEmojiTipCount(MAX_EMOJI_TIP_SHOW_COUNT + 1);
          reportClick('emoji_button', { image_id: emojiInfo.emojiId });
        }
        reportClick(
          'comment_input',
          {
            contentid: inputParams.detailId || detailId,
            commentid: resp?.newCommitId,
            status: inputParams.repliedCommentId ? 'reply' : 'comment',
            object: inputParams.repliedCommentId
          },
          'success'
        );
        useBehaviorStore.getState().add('commentTimes');
      } catch (e) {
        hideLoading();
        if ((e as { code?: number })?.code === ERR_LEGAL_RISK) {
          showGlobalToast('安全审核不通过，请重新编辑~');
        } else {
          showGlobalToast('评论失败，请重试');
        }
      }
    };

    if (CommentEventBus.checkListenersCount(CommentEvent.BEFORE_SUBMIT)) {
      CommentEventBus.emit(CommentEvent.BEFORE_SUBMIT, {
        detailId: inputParams.detailId || detailId,
        onReady: submit,
        onFail: () => {
          hideLoading();
          showGlobalToast('评论失败，请重试');
        }
      });
    } else {
      submit();
    }
  };

  const onKeyPress = ({
    nativeEvent: { key }
  }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (key === 'Enter') {
      onSubmit();
    } else if (key !== 'Backspace' && text.length >= MAX_INPUT_LENGTH) {
      showToast(`评论文字已达到上限${MAX_INPUT_LENGTH}字`);
    }
  };

  const onPressDisplayInput = () => {
    reportClick('comment_input', { contentid: detailId, from: 1 }, 'click');

    startEdit({
      parentCommentId: '',
      repliedCommentId: '',
      repliedCommentName: ''
    });
  };

  const { notificationVisible, setNotificationVisible, setInitLock } =
    useNotification({
      expire: 7,
      signal: EnotiType.notiReachDatedByComment,
      lock: true
    });

  const onCloseNotification = () => {
    setInitLock(true);
    setNotificationVisible(false);
  };

  const {
    isEmojiKeyboardVisible,
    setIsEmojiKeyboardVisible,
    switchOnKeyboard,
    switchOnEmojiKeyboard,
    renderEmojiIcon,
    selectedEmojis,
    viewEmoji,
    selectEmoji,
    cancelSelectedEmoji,
    clearSelectEmoji
  } = useEmojiKeyboard({
    inputInstance: inputRef,
    showInput: onShowInput,
    closeInput: closeCommentInput
  });

  // 表情包红点逻辑
  useEffect(() => {
    if (isEmojiKeyboardVisible && user?.uid) {
      useStorageStore
        .getState()
        .updateJsonRecord('emojiRedDotRecord', record => {
          record[user.uid] = true;
          return record;
        });
    }
  }, [isEmojiKeyboardVisible, user]);

  const allowSubmit = text.length > 0 || selectedEmojis.length > 0;

  const KeyboardIconTranslateX = useSharedValue(0);

  const $iconPositionStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: KeyboardIconTranslateX.value }]
    };
  });

  useEffect(() => {
    KeyboardIconTranslateX.value = withTiming(allowSubmit ? -49 : 0, {
      duration: 200
    });
  }, [allowSubmit]);

  useEffect(() => {
    if (editing) {
      updateEmojiTipCount();
    }
  }, [editing]);

  useEffect(() => {
    if (user?.uid) {
      const record =
        safeParseJson<Record<string, number | undefined>>(
          useStorageStore.getState().emojiInputTipRecord
        ) || {};

      const r = Number(record[user.uid]) || 0;
      liHelperDisplayCountRef.current = r;
      if (r < MAX_EMOJI_TIP_SHOW_COUNT) {
        setInputTip('可以生成表情啦！');
      }
    }
  }, [user]);

  useEffect(() => {
    CommentEventBus.emit(CommentEvent.COMMENT_INPUT_STATE_CHANGE, {
      isFocus: editing
    });
  }, [editing]);

  useEffect(() => {
    CommentEventBus.on(CommentEvent.TRIGGER_EDIT_COMMENT, startEdit);
    CommentEventBus.on(CommentEvent.COLSE_COMMENT_INPUT, closeCommentInput);

    Keyboard.addListener('keyboardDidShow', e => {
      setKeyBoardHeight(e.endCoordinates.height);
    });

    return () => {
      CommentEventBus.off(CommentEvent.TRIGGER_EDIT_COMMENT, startEdit);
      CommentEventBus.off(CommentEvent.COLSE_COMMENT_INPUT, closeCommentInput);
    };
  }, []);

  return (
    <>
      {showDisplayInput ? (
        <TouchableScale onPress={onPressDisplayInput}>
          <Animated.View
            style={[
              $placeholderContainer,
              theme === Theme.LIGHT
                ? $placeholderContainerLight
                : $placeholderContainerDark,
              { opacity: editing ? 0.6 : 1 }
            ]}
          >
            <View style={$avatarContainer}>
              <Avatar size={36} profile={user}></Avatar>
            </View>
            <Text
              style={[
                $placeholder,
                {
                  color: themeConfig.fontColor3
                }
              ]}
            >
              小狸在等你们说点什么呢~
            </Text>
            <EmojiInputIcon
              style={{ tintColor: themeConfig.fontColor }}
              onPress={() => {
                startEdit({
                  type: InputType.EMOJI,
                  parentCommentId: '',
                  repliedCommentId: '',
                  repliedCommentName: ''
                });
                reportClick('emoji_comment_button');
              }}
            />
          </Animated.View>
        </TouchableScale>
      ) : null}

      <Notification
        visible={notificationVisible}
        onClose={onCloseNotification}
        slogan={'开启 App 通知，才能及时收到互动通知噢'}
        signal={EnotiType.notiReachDatedByComment}
      />

      <Modal visible={editing} onRequestClose={closeCommentInput} transparent>
        <KeyboardAvoidingView
          behavior={isIos ? 'height' : undefined}
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 100
            }
          ]}
        >
          <View style={[$modal]}>
            <View style={$modalBackground} onTouchStart={closeCommentInput}>
              <ReAnimated.View entering={FadeIn}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.15)', 'rgba(0, 0, 0, 0)']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ height: getScreenSize('height'), width: '100%' }}
                ></LinearGradient>
              </ReAnimated.View>
              <LocalToast {...restToastProps} />
            </View>
            <View style={[$bottomContainer]}>
              <LinearGradient
                colors={[themeConfig.bg2, hex(themeConfig.bg2, 0)]}
                start={{ x: 1, y: 0.8 }}
                end={{ x: 1, y: 0 }}
                style={$gradientOnInput}
                onTouchStart={closeCommentInput}
              ></LinearGradient>

              <View style={[$inputContainer, $container]}>
                <View
                  style={[
                    $inputWrap,
                    theme === Theme.LIGHT
                      ? $placeholderContainerLight
                      : $placeholderContainerDark
                  ]}
                >
                  {inputTip ? (
                    <ReAnimated.View
                      style={StyleSheet.absoluteFill}
                      entering={FadeInDown.delay(500).duration(200)}
                    >
                      <Bubble
                        text={inputTip}
                        theme={theme}
                        style={{ position: 'absolute', right: 80, top: -35 }}
                      />
                    </ReAnimated.View>
                  ) : null}

                  <Image style={$liHelperIcon} source={ICON_li2} />
                  <TextInput
                    ref={inputRef}
                    returnKeyType="send"
                    placeholder={
                      inputParams.repliedCommentId
                        ? `回复 ${inputParams.repliedCommentName && inputParams.repliedCommentName.length > 7 ? inputParams.repliedCommentName?.slice(0, 7) + '...' : inputParams.repliedCommentName}：`
                        : '小狸在等你们说点什么呢~'
                    }
                    style={[
                      $input,
                      {
                        color: themeConfig.fontColor
                      }
                    ]}
                    placeholderTextColor={themeConfig.fontColor3}
                    value={text}
                    onLayout={isEmojiKeyboardVisible ? undefined : onShowInput}
                    onFocus={onFocus}
                    onChangeText={onChangeText}
                    onSubmitEditing={onSubmit}
                    returnKeyLabel="发送"
                    multiline
                    enablesReturnKeyAutomatically
                    maxLength={MAX_INPUT_LENGTH}
                    onKeyPress={onKeyPress}
                    onBlur={onBlur}
                  />
                  <View style={$inputBtnsContainer}>
                    <ReAnimated.View
                      style={[$keyboardIcon, $iconPositionStyle]}
                    >
                      {renderEmojiIcon({
                        isEmoji: isEmojiKeyboardVisible,
                        theme
                      })}
                    </ReAnimated.View>

                    {allowSubmit && (
                      <>
                        <ReAnimated.View entering={FadeIn}>
                          <View style={$inputBtnsDivider} />
                        </ReAnimated.View>
                        <ReAnimated.View entering={FadeIn}>
                          <TouchableOpacity onPressIn={onSubmit}>
                            <Icon icon="makephoto_submit" size={24} />
                          </TouchableOpacity>
                        </ReAnimated.View>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {selectedEmojis?.length > 0 && (
              <SelectedEmojiBar
                theme={theme}
                onPreview={viewEmoji}
                emojiList={selectedEmojis}
                onCancel={cancelSelectedEmoji}
              />
            )}
            {isEmojiKeyboardVisible && (
              <CustomKeyboard
                theme={theme}
                onSelect={selectEmoji}
                onDelete={cancelSelectedEmoji}
                dismiss={closeCommentInput}
                height={keyboardHeight}
              ></CustomKeyboard>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const $modal: ViewStyle = {
  width: '100%',
  height: '100%',
  zIndex: 100,
  position: 'relative',
  display: 'flex',
  justifyContent: 'flex-end'
};

const $modalBackground: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%'
};

const $gradientOnInput: ViewStyle = {
  height: 80
};

const $bottomContainer: ViewStyle = {
  flexShrink: 0,
  position: 'relative',
  width: '100%',
  height: 'auto',
  backgroundColor: 'transparent'
};

const $inputContainer: ViewStyle = {
  padding: 12
};

const $inputWrap: ViewStyle = {
  height: 'auto',
  paddingTop: 12,
  paddingLeft: 20,
  paddingRight: 96,
  paddingBottom: 12,
  borderRadius: 25,
  minHeight: 52
};
const $input: TextStyle = {
  width: '100%',
  fontSize: 14,
  lineHeight: 20,
  verticalAlign: 'top',
  height: 'auto',
  minHeight: 28,
  maxHeight: 180,
  fontWeight: '400',
  paddingTop: 4,
  paddingBottom: 4
};

const $inputBtnsContainer: ViewStyle = {
  position: 'absolute',
  right: 0,
  top: 0,
  paddingTop: 14,
  paddingHorizontal: 14,
  flexDirection: 'row',
  gap: 12,
  alignItems: 'center'
};

const $keyboardIcon: ViewStyle = {
  position: 'absolute',
  right: 14,
  top: 14
};

const $inputBtnsDivider: ViewStyle = {
  height: 16,
  width: 1,
  opacity: 0.2,
  backgroundColor: '#AEAEAE'
};

const $liHelperIcon: ImageStyle = {
  position: 'absolute',
  right: 30,
  top: -24,
  width: 42,
  height: 27
};

const $placeholderContainerLight: ViewStyle = {
  borderColor: 'rgba(224, 224, 224, 0.6)',
  borderWidth: 0.5,
  backgroundColor: lightSceneColor.bg,
  shadowColor: 'rgba(224, 224, 224, 1)',
  shadowOpacity: 0.6,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 0 },
  elevation: 10
};

const $placeholderContainerDark: ViewStyle = {
  backgroundColor: darkSceneColor.eleBg
};

const $placeholderContainer: ViewStyle = {
  marginLeft: 12,
  marginRight: 12,
  padding: 4,
  paddingRight: 10,
  flex: 1,
  height: 44,
  borderRadius: 36,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row'
};

const $avatarContainer: ViewStyle = {
  flex: 0,
  width: 36,
  height: 36,
  borderRadius: 18,
  marginRight: 10
};

const $placeholder: TextStyle = {
  flex: 1,
  fontSize: 14,
  fontWeight: '400',
  lineHeight: 36
};
