import { useMemoizedFn } from 'ahooks';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { RecreateEmojiRequest } from '@/src/api/emoji';
import { Header, Icon, Image, showToast } from '@/src/components';
import {
  CommentEvent,
  CommentEventBus
} from '@/src/components/comment/eventbus';
import { EMOJI_SIZE, RECREATE_TYPE } from '@/src/components/emoji/_constants';
import {
  useAdviceInput,
  useEmojiSave,
  useRoleSelect
} from '@/src/components/emoji/_hooks/create.hook';
import AddConfirm from '@/src/components/emoji/add-confirm';
import { BtnSaveEmoji } from '@/src/components/emoji/btnSaveEmoji';
import EmojiGenLoading from '@/src/components/emoji/emoji-gen-loading';
import EmojiText from '@/src/components/emoji/emoji-text';
import {
  RoleSelector,
  RoleSelectorState
} from '@/src/components/emoji/emojiRoleselector';
import PreloadImg, {
  PreloadImgOperation
} from '@/src/components/emoji/preload-img';
import { ShareEmoji } from '@/src/components/emoji/shareEmoji';
import { GetShareInfoError } from '@/src/components/share/typings';
import { useSafeAreaInsetsStyle } from '@/src/hooks';
import { selectState } from '@/src/store/_utils';
import { useEmojiStore } from '@/src/store/emoji';
import {
  CREATE_STATUS,
  EmojiRoleInfo,
  useEmojiCreatorStore
} from '@/src/store/emoji-creator';
import { createStyle, isIos } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { AdviceInput } from '@Components/adviceInput';
import ParallelWorldButton from '../parallel-world/_components/others/parallel-world-button';
import { getErrInfo } from '../parallel-world/_utils/error-msg';
import { EmojiInfo } from '@/proto-registry/src/web/raccoon/emoji/emoji_pb';
import { Role } from '@/proto-registry/src/web/raccoon/makephoto/makephoto_pb';
import { CommonActions, useNavigation } from '@react-navigation/native';

const screen = Dimensions.get('screen');

const CREATE_FAIL_IMG = require('@Assets/emoji/fail.png');

export default function Create() {
  const {
    reset,
    resetCreate,
    roleInfo,
    switchCreateStatus,
    cardInfo,
    isCreating,
    createStatus,
    createDefaultEmoji,
    createDefaultEmojiByStream,
    recreateEmoji,
    recreateEmojiByStream,
    changeEmoji,
    emojiDetail,
    toggleIsCreating,
    emojiInfo
  } = useEmojiCreatorStore(state =>
    selectState(state, [
      'reset',
      'resetCreate',
      'roleInfo',
      'cardInfo',
      'switchCreateStatus',
      'isCreating',
      'createStatus',
      'createDefaultEmoji',
      'createDefaultEmojiByStream',
      'recreateEmoji',
      'changeEmoji',
      'recreateEmojiByStream',
      'emojiDetail',
      'toggleIsCreating',
      'emojiInfo'
    ])
  );

  // 初始化的角色信息
  const defaultRole = useMemo(() => {
    let role: EmojiRoleInfo;
    if (emojiDetail?.role[0]) {
      role = {
        role: emojiDetail.role[0]?.roleId ?? '',
        brandType: emojiDetail?.brand?.brandId ?? -1
      };
    } else {
      role = roleInfo as EmojiRoleInfo;
    }
    return role;
  }, [emojiDetail, roleInfo]);

  const preloadImgRef = useRef<PreloadImgOperation>(null);

  const navigation = useNavigation();

  const { changeSelectedEmojis } = useEmojiStore(state =>
    selectState(state, ['changeSelectedEmojis'])
  );

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const [isCursorVisible, setIsCursorVisible] = useState(false);

  const abortRef = useRef<AbortController>();

  const handleCancelCreate = useMemoizedFn(() => {
    abortRef.current?.abort();
    toggleIsCreating(false);
    handleFocus();

    if (!emojiInfo?.rawUrl) {
      // 本身就失败的场景暂停，恢复失败状态
      switchCreateStatus(CREATE_STATUS.FAILED);
    } else {
      switchCreateStatus(null);
    }
  });

  const {
    defaultRoleInfo,
    curRoleInfo,
    roleSelectState,
    handleRoleSelect,
    handleToggleRoleSelect
  } = useRoleSelect({ defaultRoleInfo: defaultRole });

  const handleReCreateEmoji = useMemoizedFn(
    async (
      type: RECREATE_TYPE,
      payload: Partial<RecreateEmojiRequest> = {}
    ) => {
      if (curRoleInfo) {
        // report的触发时机可能有延迟，导致页面信息获取失败
        setTimeout(() => {
          reportClick('paint_button', {
            generate_prompt_lens: emojiText?.length,
            generate_prompt_content: emojiText,
            generate_type: type
          });
        });

        const _payload: RecreateEmojiRequest = {
          brandId: curRoleInfo?.brandType,
          roleIds: [curRoleInfo.role],
          prompt: emojiText,
          englishPrompt: '',
          ...payload
        };

        if (!_payload.prompt) {
          // switchCreateStatus(null);
          // toggleIsCreating(false);
          handleFocus();
          return;
        }

        // abort相关逻辑
        const abortController = new AbortController();
        abortRef.current = abortController;

        preloadImgRef.current?.setImgLoaded(false);

        recreateEmojiByStream(
          _payload,
          abortController.signal,
          msg => {},
          e => {
            console.log('e-------!', e, payload);
            const errCode = getErrInfo(e)?.code;
            const curEmojiInfo = useEmojiCreatorStore.getState().emojiInfo;
            if (errCode === 10005) {
              showToast('检测到敏感词汇');
              changeEmoji({
                ...curEmojiInfo,
                text: '',
                rawUrl: ''
              } as EmojiInfo);
              setTimeout(() => {
                toggleIsCreating(false);
                handleFocus();
              });
            } else {
              toggleIsCreating(false);
              changeEmoji({ ...curEmojiInfo, rawUrl: '' } as EmojiInfo);
            }
          }
        );
      }
    }
  );

  const {
    emojiText,
    setEmojiText,
    isInputVisible,
    adviceList,
    getAdvice,
    $focused,
    handleBlur,
    handleFocus,
    handleSubmitTextChange,
    handleSubmitAdviceSelect
  } = useAdviceInput({
    onCreate: handleReCreateEmoji,
    curRoleInfo: curRoleInfo as EmojiRoleInfo
  });

  const { emojiRef, savedEmoji, isSaved, uploadEmoji, handleSave } =
    useEmojiSave({
      emojiText,
      toggleCursor: setIsCursorVisible,
      curRoleInfo
    });

  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);

  const getDefaultEmoji = async () => {
    if (defaultRoleInfo?.brandType) {
      const abortController = new AbortController();

      abortRef.current = abortController;

      const payload = {
        cardId: cardInfo?.cardId || '',
        roleIds: [defaultRoleInfo.role],
        brandId: defaultRoleInfo.brandType
      };

      await createDefaultEmojiByStream(payload, abortController.signal);
    }
  };

  const getShareImgUrl = useMemoizedFn(async () => {
    if (createStatus) {
      showToast(
        createStatus === CREATE_STATUS.CREATING
          ? '小狸正在审核，请稍等～'
          : '请生成表情包再下载哦'
      );
      throw new GetShareInfoError('shareEmojiNotReady', {
        disableDefaultToast: true
      });
    } else {
      const res = await uploadEmoji();
      if (res?.image_url) {
        return res?.image_url;
      }
    }
  });

  const handleClosePress = useMemoizedFn(() => {
    if (roleSelectState === RoleSelectorState.select) {
      handleToggleRoleSelect(RoleSelectorState.show, true);
    } else {
      router.back();
    }
  });

  const goToComment = useMemoizedFn(() => {
    if (emojiDetail?.emoji) {
      navigation.dispatch(state => {
        const routesLength = state.routes.length;
        const routes = state.routes.slice(0, routesLength - 2);
        return CommonActions.reset({
          ...state,
          routes,
          index: routesLength - 3
        });
      });
    } else {
      navigation.goBack();
    }
    setTimeout(() => {
      CommentEventBus.emit(CommentEvent.TRIGGER_EDIT_COMMENT, {});
    }, 300);
  });

  const handlePublishComment = useMemoizedFn(async () => {
    reportClick('send_button');
    // 判断保存后，是否发生过修改
    if (isSaved) {
      console.log('handlePublishComment---1');
      changeSelectedEmojis([savedEmoji as EmojiInfo]);
      goToComment();
    } else {
      await handleSave(newEmoji => {
        console.log('handlePublishComment---2', newEmoji);
        if (newEmoji) {
          changeSelectedEmojis([newEmoji as EmojiInfo]);
          goToComment();
        }
      });
    }
  });

  const $emojiStyle_a = useAnimatedStyle(() => {
    const diff = 140;
    const ratio = (EMOJI_SIZE - diff) / EMOJI_SIZE;
    const offsetY = (EMOJI_SIZE * (1 - ratio)) / 2;

    return {
      transform: [
        { translateY: withTiming($focused.value ? -(offsetY + 30) : 0) },
        { scale: withTiming($focused.value ? ratio : 1) }
      ]
    };
  });

  // 初始化文案
  useEffect(() => {
    if (emojiInfo?.text) {
      setEmojiText(emojiInfo.text);
    }
  }, [emojiInfo]);

  useEffect(() => {
    getAdvice(true);
  }, [curRoleInfo]);

  useEffect(() => {
    setTimeout(() => {
      reportExpo('page_load');
    });
    // 初始化表情包
    if (emojiInfo) {
      // setSavedEmoji(emojiInfo);
      handleReCreateEmoji(RECREATE_TYPE.SAME, {
        brandId: defaultRole?.brandType,
        roleIds: [defaultRole?.role ?? ''],
        prompt: emojiInfo.text,
        englishPrompt: emojiInfo?.englishPrompt ?? ''
      });
    } else {
      getDefaultEmoji();
    }
    return () => {
      abortRef?.current?.abort();
      // 不是从recreate进入的情况，直接卸载
      if (!emojiDetail) {
        reset();
      } else {
        // 做同款，卸载部分信息
        resetCreate();
      }
    };
  }, []);

  return (
    <>
      <View style={[{ flex: 1, backgroundColor: '#23272D' }, $containerInsets]}>
        <StatusBar style="light" />
        <Header
          themeColors={{ textColor: 'white' }}
          title={
            roleSelectState === RoleSelectorState.select
              ? '选择角色'
              : '制作表情'
          }
          backButton={false}
          headerLeft={() => (
            <Pressable onPress={handleClosePress}>
              <Icon icon="close2" />
            </Pressable>
          )}
        />
        <RoleSelector
          disabled={isCreating}
          state={roleSelectState}
          role={curRoleInfo as Role}
          onStateChange={handleToggleRoleSelect}
          onRoleChange={handleRoleSelect}
          onSubmit={() =>
            handleReCreateEmoji(RECREATE_TYPE.ROLE, {
              englishPrompt: emojiInfo?.englishPrompt ?? ''
            })
          }
        />
        <KeyboardAvoidingView
          behavior={isIos ? 'height' : undefined}
          style={emojiStyles.$container}
        >
          <View style={[emojiStyles.$mask]}>
            <Animated.View style={[emojiStyles.$emojiBox, $emojiStyle_a]}>
              <Pressable onPress={handleFocus}>
                <View
                  style={emojiStyles.$emojiScreenshot}
                  ref={emojiRef as MutableRefObject<View>}
                  collapsable={false}
                >
                  {createStatus === CREATE_STATUS.FAILED ? (
                    <Image
                      source={CREATE_FAIL_IMG}
                      style={{
                        width: EMOJI_SIZE,
                        height: EMOJI_SIZE,
                        position: 'absolute'
                      }}
                    />
                  ) : emojiInfo?.rawUrl ? (
                    <PreloadImg
                      url={emojiInfo?.rawUrl}
                      size={{ height: EMOJI_SIZE, width: EMOJI_SIZE }}
                      ref={preloadImgRef}
                    />
                  ) : (
                    <View style={emojiStyles.$emojiImg} />
                  )}
                  {!isCreating && (
                    <EmojiText
                      text={emojiInfo?.text ?? ''}
                      isCursorVisible={!isInputVisible && isCursorVisible}
                      onFocus={handleFocus}
                      onLayout={() => {
                        setIsCursorVisible(true);
                      }}
                    />
                  )}
                </View>
              </Pressable>
              {!isInputVisible &&
                !isCreating &&
                createStatus !== CREATE_STATUS.FAILED && (
                  <Pressable
                    onPress={() => {
                      handleReCreateEmoji(RECREATE_TYPE.RECREATE, {
                        englishPrompt: emojiInfo?.englishPrompt ?? ''
                      });
                    }}
                    style={emojiStyles.$recreateBtn}
                  >
                    <Icon icon="reload3" size={25} />
                  </Pressable>
                )}
              {isCreating && (
                <EmojiGenLoading
                  text={emojiText}
                  isLoading={true}
                  dimension={{ width: EMOJI_SIZE, height: EMOJI_SIZE }}
                />
              )}
              {createStatus === CREATE_STATUS.FAILED && (
                <TouchableOpacity
                  onPress={() => {
                    handleReCreateEmoji(RECREATE_TYPE.RECREATE, {
                      englishPrompt: emojiInfo?.englishPrompt ?? ''
                    });
                  }}
                  style={[
                    {
                      position: 'absolute',
                      zIndex: 1,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      right: -6,
                      bottom: -6
                    }
                  ]}
                >
                  <Icon icon="reload4" size={40} />
                </TouchableOpacity>
              )}
            </Animated.View>
            {!isCreating && createStatus !== CREATE_STATUS.FAILED && (
              <BtnSaveEmoji
                isSaved={isSaved}
                onSave={handleSave}
                style={{
                  width: EMOJI_SIZE,
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }}
                tip="可以编辑文字生成表情哦!"
              ></BtnSaveEmoji>
            )}
          </View>

          <AdviceInput
            value={emojiText}
            adviceList={adviceList}
            getAdvice={getAdvice}
            visible={isInputVisible}
            onChange={setEmojiText}
            onSubmit={handleSubmitTextChange}
            onSelect={handleSubmitAdviceSelect}
            onClose={handleBlur}
          />
        </KeyboardAvoidingView>
        {roleSelectState === RoleSelectorState.select ? null : (
          <View style={btnStyles.$container}>
            <View style={btnStyles.$emojiBtnBox}>
              <ParallelWorldButton
                onPress={handlePublishComment}
                disabled={isCreating || !!createStatus}
                style={[btnStyles.$btnBasic, btnStyles.$shareBtn]}
              >
                <Icon icon="publish" size={14} />
                <Text style={btnStyles.$btnText}>发送评论</Text>
              </ParallelWorldButton>
            </View>
            <ShareEmoji
              emojiId={emojiInfo?.emojiId}
              getEmojiUrl={getShareImgUrl}
            />
          </View>
        )}
        {isCreating && (
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            style={abortStyle.$container}
          >
            <LinearGradient
              colors={[
                'rgba(35, 39, 45, 1)',
                'rgba(35, 39, 45, 0.8)',
                'rgba(35, 39, 45, 0)'
              ]}
              start={{ x: 1, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={abortStyle.$bg}
            >
              {/* create的时候不展示中断按钮 */}
              {!!emojiInfo && (
                <TouchableOpacity onPress={handleCancelCreate}>
                  <Icon icon="pause" size={50} />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </Animated.View>
        )}
      </View>
      <AddConfirm
        isVisible={isConfirmVisible}
        onClose={() => {
          setIsConfirmVisible(false);
        }}
      />
    </>
  );
}

const emojiStyles = createStyle({
  $container: {
    marginTop: 40,
    borderColor: 'green',
    flex: 1
  },
  $mask: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center'
  },
  $emojiBox: {
    height: EMOJI_SIZE,
    width: EMOJI_SIZE,
    position: 'relative',
    borderRadius: 5
    // overflow: 'hidden'
  },
  $recreateBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 1,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  $emojiScreenshot: {
    height: EMOJI_SIZE,
    width: EMOJI_SIZE,
    position: 'relative'
  },
  $emojiImg: { height: '100%', width: '100%' },
  $subtextBox: {
    paddingTop: 10,
    width: '100%',
    alignItems: 'center'
  },
  $subtext: { color: '#FFF', fontSize: 10 }
});

const btnStyles = createStyle({
  $container: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 32,
    top: screen.height - 190
  },
  $emojiBtnBox: {
    gap: 12,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  $btnBasic: { height: 40, borderRadius: 20, gap: 4 },
  $btnText: { color: 'white', fontSize: 14, fontWeight: '600' },
  $saveBtnDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff'
  },
  $saveBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)'
  },
  $shareBtn: {
    width: 256,
    backgroundColor: 'rgba(255, 106, 59, 1)'
  }
});

const abortStyle = createStyle({
  $container: {
    position: 'absolute',
    top: 580,
    left: 0,
    right: 0,
    height: screen.height - 580
  },
  $bg: {
    width: '100%',
    alignItems: 'center',
    height: '100%'
  }
});
