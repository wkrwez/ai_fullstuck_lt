import { useThrottleFn } from 'ahooks';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { getTaskByReward } from '@/src/api/reward';
import BatteryText, { EIconLightTheme } from '@/src/gums/credit/battery-text';
import { typography } from '@/src/theme';
import {
  $flex,
  $flexHBetween,
  $flexHCenter,
  $flexRow
} from '@/src/theme/variable';
import { dp2px } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import CreditCas, { CREDIT_TYPE, PLUS_COLOR } from '../credit-cas';
import Button, { EButtonType } from '../v2/button';
import { RewardTaskType } from '@/proto-registry/src/web/raccoon/reward/common_pb';
import { RecurType } from '@/proto-registry/src/web/raccoon/reward/common_pb';
import { RewardTaskDetail } from '@/proto-registry/src/web/raccoon/reward/reward_pb';

interface ITaskTabProps {
  currentTab: number;
  maxListHeight: number;
}

const taskTypeText = {
  [RewardTaskType.UNKNOWN]: '去完成',
  [RewardTaskType.COMMENT]: '去评论',
  [RewardTaskType.LIKE_CARD]: '去点赞',
  [RewardTaskType.SHARE]: '去分享',
  [RewardTaskType.PUBLISH]: '去发布'
};

export default function TaskTab({ currentTab, maxListHeight }: ITaskTabProps) {
  const [taskList, setTaskList] = useState<RewardTaskDetail[]>([]);

  useEffect(() => {
    reportExpo('task_tab');
  }, []);

  const doPress = (type: RewardTaskType) => {
    reportClick('task', {
      task_type: type
    });
    switch (type) {
      case RewardTaskType.COMMENT: {
        router.push({
          pathname: '/feed/'
        });
        break;
      }
      case RewardTaskType.LIKE_CARD: {
        router.push({
          pathname: '/feed/'
        });
        break;
      }
      case RewardTaskType.SHARE: {
        router.push({
          pathname: '/feed/'
        });
        break;
      }
      case RewardTaskType.PUBLISH: {
        router.push({
          pathname: ('/feed/?expand=' + Date.now()) as RelativePathString
        });
        break;
      }
      case RewardTaskType.UNKNOWN: {
        router.push({
          // stack 并不销毁
          pathname: '/feed/'
        });
        break;
      }
    }
  };

  const todayBattery = useMemo(() => {
    return (
      taskList?.reduce((p, c) => {
        return p + c.gainedPoints;
      }, 0) || 0
    );
  }, [taskList]);

  const todayRestBattery = useMemo(() => {
    return (
      (taskList?.reduce((p, c) => {
        return p + c.limit;
      }, 0) || 0) - todayBattery
    );
  }, [taskList, todayBattery]);

  const getTaskList = async () => {
    try {
      const res = await getTaskByReward();
      setTaskList(res.taskDetails);
      console.log(res.taskDetails, 'res.taskDetailsres.taskDetails');
    } catch (error) {
      console.log(error, 'error res.taskDetailsres.taskDetails');
    }
  };

  useEffect(() => {
    getTaskList();
  }, []);

  useEffect(() => {
    if (taskList.length) {
      taskList?.forEach(item => {
        const isDone = item.limit <= item.gainedPoints;
        reportExpo('task', {
          task_type: item.taskType,
          task_condition: isDone ? 1 : 0
        });
      });
    }
  }, [taskList]);

  const switchHasAccom = (count: number, type: RewardTaskType) => {
    switch (type) {
      case RewardTaskType.COMMENT: {
        return `已评论${count}个作品，获得`;
      }
      case RewardTaskType.LIKE_CARD: {
        return `已点赞${count}个作品，获得`;
      }
      case RewardTaskType.SHARE: {
        return `已分享${count}个作品，获得`;
      }
      case RewardTaskType.PUBLISH: {
        return `已发布${count}个作品，获得`;
      }
      case RewardTaskType.UNKNOWN: {
        return `已完成${count}个作品，获得`;
      }
    }
  };

  const getRefreshTint = (loopType: RecurType) => {
    switch (loopType) {
      case RecurType.DAY_LOOP: {
        return '每日 0:00 刷新';
      }
      case RecurType.WEEK_LOOP: {
        return '每周 0:00 刷新';
      }
      default: {
        return '';
      }
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[
        $insetWrapper,
        {
          height: maxListHeight,
          overflowX: 'hidden',
          marginBottom: currentTab === 0 ? 86 : 0
        }
      ]}
    >
      <View
        style={{
          flex: 1,
          position: 'relative'
        }}
      >
        <View style={[$task, $flex]}>
          <View
            style={[
              $flexHCenter,
              {
                marginTop: 24
              }
            ]}
          >
            <Text style={$taskHeader}>
              已获得 {todayBattery} 狸电池，还可以获得
            </Text>
            <BatteryText
              theme={EIconLightTheme.GREEN}
              text={todayRestBattery + ''}
            ></BatteryText>
            <Text style={$taskHeader}>狸电池</Text>
          </View>
          <View style={[$taskList]}>
            {taskList?.map((t, tIndex) => {
              const isDone = t.limit <= t.gainedPoints;
              return (
                <View
                  style={[
                    $taskItem,
                    {
                      borderBottomWidth:
                        tIndex === taskList.length - 1 ? 0 : 0.5
                    }
                  ]}
                  key={tIndex}
                >
                  <View style={$taskLeft}>
                    <View style={$taskTitle}>
                      <Text style={$taskNum}>{t.display}</Text>
                      <CreditCas
                        theme={CREDIT_TYPE.PLUS}
                        borderColors={['transparent', 'transparent']}
                        insetsColors={['transparent', 'transparent']}
                        text={'+' + t.perEarn + ''}
                        size={20}
                        $customTextStyle={{
                          color: PLUS_COLOR,
                          fontSize: 13,
                          lineHeight: 20
                        }}
                      ></CreditCas>
                    </View>
                    <View style={$taskBottom}>
                      <Text style={$taskCost}>
                        {switchHasAccom(t.completedCount, t.taskType)}
                      </Text>
                      <BatteryText
                        theme={EIconLightTheme.GRAY}
                        text={t.gainedPoints + '/' + t.limit + ''}
                      ></BatteryText>
                      <Text style={$taskCost}>狸电池</Text>
                    </View>
                  </View>
                  <View>
                    {isDone ? (
                      <Button
                        type={EButtonType.NORMAL}
                        $customBtnStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.10)',
                          pointerEvents: 'none',
                          paddingHorizontal: dp2px(16),
                          paddingVertical: dp2px(4)
                        }}
                        $customBtnTextStyle={{
                          color: 'rgba(255, 255, 255, 0.30)'
                        }}
                      >
                        已完成
                      </Button>
                    ) : (
                      <Button
                        type={EButtonType.NORMAL}
                        $customBtnStyle={{
                          paddingHorizontal: dp2px(16),
                          paddingVertical: dp2px(4)
                        }}
                        onPress={() => doPress(t.taskType)}
                      >
                        {taskTypeText[t.taskType]}
                      </Button>
                    )}
                    <Text style={$refreshTint}>
                      {getRefreshTint(t.recurType)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const $insetWrapper: ViewStyle = {
  marginBottom: dp2px(40)
};

const $task: ViewStyle = {
  paddingBottom: 42,
  paddingHorizontal: 20
};

const $taskHeader: TextStyle = {
  color: 'rgba(255, 255, 255, 0.40)',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 13,
  fontWeight: '400',
  lineHeight: 20
};

const $taskList: ViewStyle = {};

const $refreshTint: TextStyle = {
  color: 'rgba(255, 255, 255, 0.30)',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 10,
  fontWeight: '400',
  lineHeight: 16,
  marginTop: 2
};

const $taskItem: ViewStyle = {
  ...$flex,
  ...$flexRow,
  ...$flexHBetween,
  height: dp2px(84),
  borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  borderBottomWidth: 1
};

const $taskLeft: ViewStyle = {};
const $taskTitle: ViewStyle = {
  ...$flexRow,
  ...$flexHCenter,
  height: 20
};
const $taskNum: TextStyle = {
  color: 'rgba(255, 255, 255, 0.90)',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 15,
  fontWeight: '600',
  lineHeight: 20,
  marginRight: 10
};
const $taskBottom: ViewStyle = {
  ...$flexHCenter,
  marginTop: 4
};
const $taskCost: TextStyle = {
  color: 'rgba(255, 255, 255, 0.40)',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 13,
  fontWeight: '400',
  lineHeight: 20
};
