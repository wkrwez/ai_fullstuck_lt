import { useDebounceFn, useRequest } from 'ahooks';
import React, { useEffect } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import {
  Icon,
  IconContinue,
  hideLoading,
  showLoading,
  showToast
} from '@/src/components';
import { selectState } from '@/src/store/_utils';
import {
  PARALLEL_WORLD_PAGES_ENUM,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import {
  PLOT_CREATE_STATUS_ENUM,
  useParallelWorldConsumerStore
} from '@/src/store/parallel-world-consumer';
import { colors, typography } from '@/src/theme';
import { $flexHCenter } from '@/src/theme/variable';
import { StyleSheet, isIos } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { parallelWorldColors } from '../../_constants';
import { useCreatePlot } from '../../_hooks/create-plot.hook';
import AiGenTextarea from '../others/ai-gen-textarea';
import LinearGradientCard from '../others/linear-gradient-card';
import ParallelWorldButton from '../others/parallel-world-button';
import UserDisplay from '../others/user-display';
import { WorldAct } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { useShallow } from 'zustand/react/shallow';

const { width: screenW } = Dimensions.get('window');

export default function NextChapterModal() {
  const {
    plotCreateStatus,
    newTimeLine,
    newWorld,
    getAiChoices,
    aiPlotChoices,
    choiceText,
    changeChoiceText,
    activeTimelineSectionIdx,
    updateActs,
    acts,
    isActsSaved,
    closeNextChapterModal
  } = useParallelWorldConsumerStore(
    useShallow(state =>
      selectState(state, [
        'plotCreateStatus',
        'newTimeLine',
        'newWorld',
        'getAiChoices',
        'aiPlotChoices',
        'choiceText',
        'changeChoiceText',
        'activeTimelineSectionIdx',
        'updateActs',
        'acts',
        'isActsSaved',
        'closeNextChapterModal'
      ])
    )
  );

  const { pushWorldRouteStack } = useParallelWorldStore(
    useShallow(state => selectState(state, ['pushWorldRouteStack']))
  );

  const { run: handleRefreshAiChoice, loading: isAiChoiceLoading } = useRequest(
    async () => {
      showLoading();
      await getAiChoices({
        cardId: newWorld?.cardId as string,
        plotId: newTimeLine[activeTimelineSectionIdx]?.plotId
      });
      hideLoading();
    },
    { manual: true }
  );

  const inputRef = React.useRef<TextInput>(null);

  const handleInputBlur = () => {
    inputRef.current?.blur();
  };

  const { createPlot } = useCreatePlot();

  const { run: handleCreatePlot } = useDebounceFn(
    async () => {
      inputRef.current?.blur();
      createPlot();
      reportClick('set_next_world', {
        contentid: newWorld?.cardId,
        world_contentid: newWorld?.worldId,
        set_next_world_button: 4
      });
    },
    { wait: 300 }
  );

  // TODO: 后续优化
  useEffect(() => {
    if (!isActsSaved) {
      updateActs({
        cardId: newWorld?.cardId as string,
        plotId: newTimeLine[activeTimelineSectionIdx]?.plotId,
        acts: acts as WorldAct[]
      });
    }
  }, [isActsSaved]);

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        height: '100%',
        width: '100%',
        flex: 1
      }}
    >
      <KeyboardAvoidingView
        behavior={isIos ? 'padding' : undefined}
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: 1
          }
        ]}
      >
        <Pressable
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          onPress={handleInputBlur}
        >
          <LinearGradientCard
            style={{
              paddingHorizontal: 28,
              paddingTop: 16,
              width: screenW - 36,
              paddingBottom: 20
            }}
            innerStyle={{ gap: 14 }}
          >
            <View style={{ ...$flexHCenter, justifyContent: 'space-between' }}>
              <Pressable
                onPress={closeNextChapterModal}
                disabled={plotCreateStatus < PLOT_CREATE_STATUS_ENUM.CREATED}
                style={{
                  opacity:
                    plotCreateStatus < PLOT_CREATE_STATUS_ENUM.CREATED ? 0.6 : 1
                }}
              >
                <Icon icon={'close2'} size={16} />
              </Pressable>
              <Pressable
                onPress={handleRefreshAiChoice}
                style={{
                  ...$flexHCenter,
                  justifyContent: 'flex-end',
                  gap: 4,
                  opacity: isAiChoiceLoading ? 0.6 : 1
                }}
              >
                <Icon icon="reload2" size={12} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: colors.white
                  }}
                >
                  换一换
                </Text>
              </Pressable>
            </View>
            {aiPlotChoices.map((choice, idx) => (
              <AiGenTextarea key={choice?.choice ?? idx}>
                <Pressable
                  onPress={() => {
                    changeChoiceText(choice.choice);
                  }}
                  style={{
                    ...$flexHCenter,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 4,
                    paddingTop: 18,
                    paddingBottom: 16,
                    paddingHorizontal: 18
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: '400',
                      fontFamily: typography.fonts.world
                    }}
                    numberOfLines={2}
                  >
                    {choice.choice}
                  </Text>
                  <Icon icon="icon_edit_glow" size={12} />
                </Pressable>
              </AiGenTextarea>
            ))}
            <View
              style={{
                ...$flexHCenter,
                paddingVertical: 30,
                justifyContent: 'center'
              }}
            >
              <UserDisplay text=""></UserDisplay>
              <TextInput
                allowFontScaling={false}
                value={choiceText}
                ref={inputRef}
                style={{
                  fontSize: 18,
                  // lineHeight: 18,
                  fontFamily: typography.fonts.world,
                  color: parallelWorldColors.fontGlow
                }}
                returnKeyType="send"
                placeholder="请输入世界线发展的关键剧情..."
                selectionColor={parallelWorldColors.fontGlow}
                placeholderTextColor="rgba(127, 217, 255, 0.6)"
                onChangeText={changeChoiceText}
                onBlur={handleInputBlur}
                // onSubmitEditing={() => onSubmit(value)}
                multiline
                returnKeyLabel="发送"
                enablesReturnKeyAutomatically
                maxLength={60}
                onKeyPress={({ nativeEvent: { key } }) => {
                  if (key !== 'Backspace' && choiceText.length >= 60) {
                    showToast('评论文字已达到上限60字');
                  }
                }}
              />
            </View>

            <View style={{ alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  borderRadius: 21,
                  padding: 2,
                  borderWidth: 1,
                  borderColor: parallelWorldColors.fontGlow
                }}
              >
                <ParallelWorldButton
                  style={{
                    backgroundColor: '#FF6A3B',
                    borderRadius: 19,
                    width: 196,
                    height: 38
                  }}
                  disabled={
                    !choiceText ||
                    plotCreateStatus < PLOT_CREATE_STATUS_ENUM.CREATED
                  }
                  // onPress={handleCreatePlot}
                  onPress={handleCreatePlot}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.white,
                        lineHeight: 18
                      }}
                    >
                      继续下一节
                    </Text>
                    <IconContinue fill={colors.white} size={18} />
                  </View>
                </ParallelWorldButton>
              </View>

              <ParallelWorldButton
                style={{
                  borderRadius: 21,
                  borderColor: colors.white,
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  width: 200,
                  height: 42
                }}
                onPress={() => {
                  // switchParallelWorldPage(PARALLEL_WORLD_PAGES_ENUM.PUBLISH);
                  pushWorldRouteStack({
                    route: PARALLEL_WORLD_PAGES_ENUM.PUBLISH
                  });
                  reportClick('set_next_world', {
                    contentid: newWorld?.cardId,
                    world_contentid: newWorld?.worldId,
                    set_next_world_button: 5
                  });
                }}
                disabled={plotCreateStatus < PLOT_CREATE_STATUS_ENUM.CREATED}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    position: 'relative',
                    gap: 4
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.white,
                      lineHeight: 18
                    }}
                  >
                    留给他人续写
                  </Text>
                  <Icon icon="publish_pw" size={16} />
                </View>
              </ParallelWorldButton>
            </View>
          </LinearGradientCard>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}
