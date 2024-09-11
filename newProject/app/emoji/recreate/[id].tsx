import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { saveEmoji } from '@/src/api/emoji';
import { Header, Icon, Image, showToast } from '@/src/components';
import { EMOJI_SIZE } from '@/src/components/emoji/_constants';
import { useImgPreview } from '@/src/components/emoji/_hooks/img-preview.hook';
import { useResetOnUnmount } from '@/src/components/emoji/_hooks/reset.hook';
import { BtnSaveEmoji } from '@/src/components/emoji/btnSaveEmoji';
import { ShareEmoji } from '@/src/components/emoji/shareEmoji';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState, useSafeAreaInsetsStyle } from '@/src/hooks';
import { selectState } from '@/src/store/_utils';
import { useEmojiStore } from '@/src/store/emoji';
import { useEmojiCreatorStore } from '@/src/store/emoji-creator';
import { StyleSheet, createStyle } from '@/src/utils';
import { logWarn } from '@/src/utils/error-log';
import { reportClick, reportExpo } from '@/src/utils/report';
import ParallelWorldButton from '../../parallel-world/_components/others/parallel-world-button';

const screen = Dimensions.get('screen');

export default function Recreate() {
  const { id: emojiId } = useLocalSearchParams();

  const { init: initEmojis } = useEmojiStore(state =>
    selectState(state, ['init'])
  );

  const { getEmojiDetail, emojiDetail, changeEmoji } = useEmojiCreatorStore(
    state =>
      selectState(state, ['getEmojiDetail', 'emojiDetail', 'changeEmoji'])
  );

  const { loginIntercept } = useAuthState();

  const handleSaveEmoji = async () => {
    try {
      reportClick(' attend_others_button', {
        emoji_id: emojiDetail?.emoji?.emojiId ?? ''
      });
      loginIntercept(
        async () => {
          if (emojiDetail?.emoji?.emojiId) {
            const res = await saveEmoji({
              emojiId: emojiDetail?.emoji?.emojiId as string
            });
            console.log('saveEmoji------>', res);
            if (res) {
              showToast(
                <View style={{ backgroundColor: 'transparent' }}>
                  <Text style={{ color: '#fff' }}>添加成功</Text>
                </View>
              );
              getEmojiDetail({
                emojiId: emojiDetail?.emoji?.emojiId as string
              });
              initEmojis();
            }
          }
        },
        {
          scene: LOGIN_SCENE.TAKE_SAME_STYLE
        }
      );
    } catch (e) {
      logWarn('handleSaveEmoji', e);
    }
  };

  const handleCreateSame = () => {
    loginIntercept(
      () => {
        if (emojiDetail?.emoji) {
          changeEmoji(emojiDetail?.emoji);
          reportClick('copy_button', {
            emoji_id: emojiDetail?.emoji?.emojiId ?? ''
          });
          router.push(`/emoji/create`);
        }
      },
      {
        scene: LOGIN_SCENE.TAKE_SAME_STYLE
      }
    );
  };

  const handleBack = () => {
    router.back();
  };

  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);

  const { entering, exiting, isImgLoaded } = useImgPreview();

  useEffect(() => {
    reportExpo('enter_create_same', { emoji_id: emojiId });
    getEmojiDetail({ emojiId: emojiId as string });
  }, []);

  useResetOnUnmount();

  return (
    <View style={[{ flex: 1, backgroundColor: '#23272D' }, $containerInsets]}>
      <StatusBar style="light" />
      <Header
        onBack={handleBack}
        themeColors={{ textColor: 'white' }}
        title="表情预览"
      />
      <View style={{ height: 106 }} />
      <View style={emojiStyles.$container}>
        <View style={emojiStyles.$emojiBox}>
          <Image
            source={{ uri: emojiDetail?.emoji?.wholeImageUrl }}
            style={emojiStyles.$emojiImg}
          />

          {!isImgLoaded && (
            <Animated.View
              entering={entering}
              exiting={exiting}
              style={{ position: 'absolute', zIndex: 10 }}
            >
              <Image
                tosSize="size6"
                source={{ uri: emojiDetail?.emoji?.wholeImageUrl }}
                style={emojiStyles.$emojiImg}
              />
              <BtnSaveEmoji
                isSaved={emojiDetail?.isSaved || false}
                onSave={handleSaveEmoji}
              />
              {/* <View
                style={[
                  StyleSheet.rowStyle,
                  {
                    marginTop: 10,
                    paddingHorizontal: 13,
                    paddingVertical: 9,
                    alignItems: 'center',
                    gap: 4
                  }
                ]}
              >
                <Icon
                  icon={emojiDetail?.isSaved ? 'emoji_added' : 'emoji_add'}
                  size={16}
                />
                <Text style={btnStyles.$btnText}>
                  {emojiDetail?.isSaved ? '已添加到表情' : '添加到表情'}
                </Text>
              </View> */}
            </Animated.View>
          )}
        </View>
      </View>
      <View style={btnStyles.$container}>
        <View style={btnStyles.$emojiBtns}>
          {/* <ParallelWorldButton
            onPress={handleSaveEmoji}
            disabled={emojiDetail?.isSaved}
            style={[
              btnStyles.$basicBtn,
              emojiDetail?.isSaved
                ? btnStyles.$saveDisabled
                : btnStyles.$saveActive
            ]}
          >
            <Icon
              icon={emojiDetail?.isSaved ? 'emoji_added' : 'emoji_add'}
              size={16}
            />
            <Text style={btnStyles.$btnText}>
              {emojiDetail?.isSaved ? '已添加到表情' : '添加到表情'}
            </Text>
          </ParallelWorldButton> */}
          <ParallelWorldButton
            onPress={handleCreateSame}
            style={[btnStyles.$basicBtn, btnStyles.$makeSame]}
          >
            <Icon icon="emoji_same" size={18} />
            <Text style={btnStyles.$btnText}>做同款</Text>
          </ParallelWorldButton>
        </View>

        <ShareEmoji
          emojiId={emojiDetail?.emoji?.emojiId}
          getEmojiUrl={() => emojiDetail?.emoji?.wholeImageUrl}
        />
      </View>
    </View>
  );
}

const emojiStyles = createStyle({
  $container: { marginTop: 40, flex: 1 },
  $emojiBox: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  $emojiImg: { height: EMOJI_SIZE, width: EMOJI_SIZE }
});

const btnStyles = createStyle({
  $container: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 32,
    top: screen.height - 190
  },
  $emojiBtns: {
    gap: 12,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  $basicBtn: { height: 40, borderRadius: 20, gap: 8 },
  $btnText: { color: 'white', fontSize: 14, fontWeight: '600' },
  $saveDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff'
  },
  $saveActive: {
    backgroundColor: 'rgba(255, 106, 59, 1)'
  },
  $makeSame: {
    width: 256,
    backgroundColor: 'rgba(255, 255, 255, 0.14)'
  }
});
