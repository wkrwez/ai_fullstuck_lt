import { useDebounceFn } from 'ahooks';
import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  View
} from 'react-native';
import { CreateWorldRequest } from '@/src/api/parallel-world/feed';
import { IconContinue, showToast } from '@/src/components';
import { AnimatedImage } from '@/src/components/animatedImage';
import { selectState } from '@/src/store/_utils';
import {
  FOLD_STATUS_ENUM,
  PARALLEL_WORLD_PAGES_ENUM,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import {
  PLOT_CREATE_STATUS_ENUM,
  useParallelWorldConsumerStore
} from '@/src/store/parallel-world-consumer';
import { useParallelWorldFeedStore } from '@/src/store/parallel-world-feed';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { colors, rowStyle, typography } from '@/src/theme';
import { $flexHBetween } from '@/src/theme/variable';
import { isIos } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { StyleSheet, createStyle } from '@Utils/StyleSheet';
import { parallelWorldColors } from '../../_constants';
import { useCreatePlotInNewWorld } from '../../_hooks/create-plot-in-new-world';
import { useReset } from '../../_hooks/reset.hook';
import LiHelp, { CHOICE_FAIL_TIP, CHOICE_LOADING_TIP } from '../others/li-help';
import LinearGradientCard from '../others/linear-gradient-card';
import ParallelWorldButton from '../others/parallel-world-button';
import UserDisplay from '../others/user-display';
import { useShallow } from 'zustand/react/shallow';
import KeywordLabel from './keyword-label';

const KEYWORDS_BG = require('@Assets/image/parallel-world/keywords-bg.png');

const MAX_INPUT_LENGTH = 60;

const SAME_WORLD_LINE_TIP = '检测到完全相同的世界线，正在进入...';
const SAME_WORLD_LINE_DELAY = 500;

const L4_IMG = require('@Assets/apng/l4.png');

const CreateButton = ({
  onPress,
  disabled = false
}: {
  onPress: () => void;
  disabled?: boolean;
}) => (
  <View
    style={{
      position: 'relative',
      ...rowStyle,
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1
    }}
  >
    <View
      style={{
        borderRadius: 12,
        padding: 2,
        borderWidth: 1,
        borderColor: parallelWorldColors.fontGlow
      }}
    >
      <ParallelWorldButton
        style={{
          backgroundColor: '#FF6A3B',
          borderRadius: 8,
          width: 256,
          height: 38
        }}
        disabled={disabled}
        onPress={onPress}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: colors.white,
              lineHeight: 18
            }}
          >
            开启新世界线
          </Text>
          <View style={{ position: 'absolute', right: -20 }}>
            <IconContinue fill={colors.white} size={18} />
          </View>
        </View>
      </ParallelWorldButton>
    </View>
  </View>
);

const FeedInputModal = ({
  isVisible,
  onClose
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const {
    switchPageFoldStatus,
    popWorldRouteStack,
    pushWorldRouteStack,
    toggleParallelWorldLoading
  } = useParallelWorldStore(
    useShallow(state =>
      selectState(state, [
        'switchPageFoldStatus',
        'popWorldRouteStack',
        'pushWorldRouteStack',
        'toggleParallelWorldLoading'
      ])
    )
  );

  const {
    createChoice,
    closeFeedInputModal,
    choiceText,
    changeChoiceText,
    isCreatingChoice,
    lastCreateWorldPayload,
    plotTags,
    changeLastCreateWorldPayload,
    toggleIsCreatingChoice
  } = useParallelWorldFeedStore(
    useShallow(state =>
      selectState(state, [
        'createChoice',
        'closeFeedInputModal',
        'choiceText',
        'changeChoiceText',
        'isCreatingChoice',
        'lastCreateWorldPayload',
        'plotTags',
        'changeLastCreateWorldPayload',
        'toggleIsCreatingChoice'
      ])
    )
  );

  const { createParallelWorld, changePlotCreateStatus } =
    useParallelWorldConsumerStore(
      useShallow(state =>
        selectState(state, ['createParallelWorld', 'changePlotCreateStatus'])
      )
    );

  const { activeTimelineSectionIdx, timeline, worldInfo } =
    useParallelWorldMainStore(
      useShallow(state =>
        selectState(state, [
          'activeTimelineSectionIdx',
          'timeline',
          'worldInfo'
        ])
      )
    );

  const { resetConsumer } = useReset();

  const [active, setActive] = useState<number>(0);

  const inputRef = useRef<TextInput>(null);

  // TODO:研究一下为什么
  const handleFocus = () => {
    if (Platform.OS === 'android') {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setTimeout(() => inputRef.current?.focus());
    }
  };

  const handleChange = (text: string) => {
    if (text === CHOICE_LOADING_TIP) return;
    changeChoiceText(text);
  };

  const handleClose = () => {
    if (choiceText === CHOICE_FAIL_TIP || choiceText === CHOICE_LOADING_TIP) {
      toggleIsCreatingChoice(false);
      changeChoiceText('');
    }
    onClose();
  };

  const { createPlot } = useCreatePlotInNewWorld();

  const { run: handleCreateWorld } = useDebounceFn(
    async () => {
      const payload: CreateWorldRequest = {
        cardId: worldInfo.cardId,
        plotId: timeline[activeTimelineSectionIdx]?.plotId,
        tagCode: plotTags[active].code
      };
      try {
        closeFeedInputModal();
        if (
          isEqual({ ...payload, choice: choiceText }, lastCreateWorldPayload)
        ) {
          showToast(SAME_WORLD_LINE_TIP, SAME_WORLD_LINE_DELAY);
          setTimeout(() => {
            // switchParallelWorldPage(PARALLEL_WORLD_PAGES_ENUM.CONSUMER);
            const consumerState = useParallelWorldConsumerStore.getState();
            pushWorldRouteStack({
              route: PARALLEL_WORLD_PAGES_ENUM.CONSUMER,
              cardId: consumerState.newWorld?.cardId,
              plotId: consumerState?.plotId
            });
            switchPageFoldStatus(FOLD_STATUS_ENUM.UNFOLD);
            const { plotCreateStatus } =
              useParallelWorldConsumerStore.getState();
            // 如果plotContent正在展示，直接切换为ACT_CREATING状态
            if (plotCreateStatus < PLOT_CREATE_STATUS_ENUM.ACT_CREATING) {
              changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.ACT_CREATING);
            }
          }, SAME_WORLD_LINE_DELAY);
        } else {
          // 进入前清空consumer状态
          resetConsumer();
          // 加载页面
          toggleParallelWorldLoading(true);
          // 创建新世界线之前清空世界线
          await createParallelWorld(payload);

          await createPlot();

          // 创建成功，存储上次请求的参数
          changeLastCreateWorldPayload({ ...payload, choice: choiceText });
        }

        reportClick('world_set_world', {
          contentid: worldInfo.cardId,
          plotId: timeline[activeTimelineSectionIdx]?.plotId,
          tagCode: plotTags[active].code,
          set_world_button: 1
        });
      } catch (e) {
        console.log('createParallelWorld:', e);
        console.log('createParallelWorld PAYLOAD:', payload);

        showToast('创建世界线失败!');
        // resetConsumer();
        toggleParallelWorldLoading(false);
        switchPageFoldStatus(FOLD_STATUS_ENUM.UNFOLD);
        // switchParallelWorldPage(PARALLEL_WORLD_PAGES_ENUM.FEED);
        const worldState = useParallelWorldStore.getState();
        const routeStack = worldState.worldRouteStack;
        if (
          routeStack[routeStack.length - 1].route !==
          PARALLEL_WORLD_PAGES_ENUM.FEED
        ) {
          popWorldRouteStack();
        }
      }
    },
    {
      wait: 300
    }
  );

  useEffect(() => {
    reportExpo('world_set_world', { contentid: worldInfo.cardId });
  }, [isVisible]);

  return (
    <Modal visible={isVisible} onRequestClose={handleClose} transparent>
      <KeyboardAvoidingView
        behavior={isIos ? 'height' : undefined}
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: 100
          }
        ]}
      >
        <View style={styles.$modal}>
          <View onTouchStart={handleClose} style={styles.$placeholder}></View>
          <View style={styles.$inputContainer}>
            {/* <View style={{ padding: 12 }}> */}
            <ImageBackground
              style={styles.$keywordsContainer}
              source={KEYWORDS_BG}
            >
              {plotTags.map((tag, index) => (
                <KeywordLabel
                  tag={tag}
                  key={tag.code}
                  isActive={active === index}
                  onPress={() => {
                    // 不支持非选中状态
                    setActive(index);
                    const tagMap = [3, 4, 7];
                    reportClick('world_set_world', {
                      contentid: worldInfo.cardId,
                      set_world_button: tagMap[index]
                    });
                  }}
                />
              ))}
            </ImageBackground>
            <LinearGradientCard
              style={styles.$inputWrap}
              innerStyle={{ gap: 12 }}
            >
              <View style={styles.$inputHeader}>
                <UserDisplay text="你" />
                <LiHelp
                  onPress={() => {
                    createChoice({
                      cardId: worldInfo.cardId,
                      prePlotId: timeline[activeTimelineSectionIdx]?.plotId,
                      tagCode: plotTags[active].code
                    });
                    reportClick('world_set_world', {
                      set_world_button: 2,
                      contentid: worldInfo.cardId,
                      world_contentid: choiceText
                    });
                  }}
                  disabled={isCreatingChoice}
                />
              </View>
              <TextInput
                allowFontScaling={false}
                ref={inputRef}
                style={styles.$input}
                value={isCreatingChoice ? CHOICE_LOADING_TIP : choiceText}
                placeholder="输入一条新的世界线..."
                selectionColor={parallelWorldColors.fontGlow}
                placeholderTextColor="rgba(127, 217, 255, 0.6)"
                onLayout={handleFocus}
                onChangeText={handleChange}
                onKeyPress={({ nativeEvent: { key } }) => {
                  if (
                    key !== 'Backspace' &&
                    choiceText.length >= MAX_INPUT_LENGTH
                  ) {
                    showToast('文字已达到上限60字');
                  }
                }}
                onSubmitEditing={handleCreateWorld}
                multiline
                maxLength={60}
                enablesReturnKeyAutomatically
              />
              <CreateButton
                onPress={handleCreateWorld}
                disabled={
                  !choiceText ||
                  isCreatingChoice ||
                  choiceText === CHOICE_FAIL_TIP
                }
              />
            </LinearGradientCard>
            {/* </View> */}

            <AnimatedImage
              style={[
                {
                  position: 'absolute',
                  top: '-5%',
                  left: '-5%',
                  width: '110%',
                  height: '110%'
                }
              ]}
              source={L4_IMG}
              duration={500}
            ></AnimatedImage>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export { FeedInputModal };

const styles = createStyle({
  $modal: {
    width: '100%',
    height: '100%',
    zIndex: 100,
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  $placeholder: {
    flexGrow: 1,
    zIndex: -1000,
    flexShrink: 1,
    width: '100%',
    height: '100%'
  },
  $inputContainer: {
    flexShrink: 0,
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    overflow: 'visible',
    padding: 12
  },
  $keywordsContainer: {
    width: '100%',
    height: 115,
    position: 'absolute',
    zIndex: -1000,
    top: -80,
    paddingTop: 48,
    flexDirection: 'row'
  },
  $inputWrap: {
    position: 'relative',
    width: '100%',
    // paddingVertical: 12
    paddingBottom: 12
  },
  $inputHeader: {
    ...$flexHBetween,
    backgroundColor: '#435F7C',
    height: 48,
    paddingHorizontal: 10
  },
  $input: {
    fontSize: 18,
    marginHorizontal: 12,
    color: parallelWorldColors.fontGlow,
    fontFamily: typography.fonts.world,
    fontWeight: '400'
  }
});
