import { StyleProp, View, ViewStyle } from 'react-native';
import { selectState } from '@/src/store/_utils';
import {
  PARALLEL_WORLD_PAGES_ENUM,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import { useParallelWorldConsumerStore } from '@/src/store/parallel-world-consumer';
import { colors } from '@/src/theme';
import { StyleSheet } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Text } from '@Components/text';
import TimelineBottom from '../bottomBar/timeline-bottom';
import ParallelWorldButton from '../others/parallel-world-button';
import { useShallow } from 'zustand/react/shallow';

interface BottomBarProps {
  barStyle?: StyleProp<ViewStyle>;
}

export default function ConsumerBottomBar(props: BottomBarProps) {
  const { pushWorldRouteStack } = useParallelWorldStore(
    useShallow(state => selectState(state, ['pushWorldRouteStack']))
  );

  const {
    newTimeLine,
    activeTimelineSectionIdx,
    changeActiveTimelineSectionIdx,
    getPlot
  } = useParallelWorldConsumerStore(
    useShallow(state =>
      selectState(state, [
        'newTimeLine',
        'activeTimelineSectionIdx',
        'changeActiveTimelineSectionIdx',
        'getPlot'
      ])
    )
  );

  return (
    <TimelineBottom
      sections={newTimeLine}
      key={newTimeLine.length}
      active={activeTimelineSectionIdx}
      onActive={idx => {
        changeActiveTimelineSectionIdx(idx);
        getPlot({ plotId: newTimeLine[idx]?.plotId });
      }}
      barRight={
        <ParallelWorldButton
          onPress={() => {
            // switchParallelWorldPage(PARALLEL_WORLD_PAGES_ENUM.PUBLISH);
            pushWorldRouteStack({ route: PARALLEL_WORLD_PAGES_ENUM.PUBLISH });
          }}
          style={{
            height: 40,
            borderRadius: 20,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.white
          }}
        >
          <Text style={buttonStyles.$text}>先写到这里</Text>
          <Icon icon="publish_pw" size={16} />
        </ParallelWorldButton>
      }
    />
  );
}

const buttonStyles = StyleSheet.create({
  $text: {
    marginRight: 4,
    fontWeight: '500',
    fontSize: 16,
    color: StyleSheet.currentColors.white
  }
});
