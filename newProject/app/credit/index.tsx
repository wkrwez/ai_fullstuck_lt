import { useDebounce, useDebounceFn, useThrottleFn } from 'ahooks';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ImageStyle,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { pointsClient } from '@/src/api/points';
import { Icon, showConfirm } from '@/src/components';
import { CREDIT_LIMIT } from '@/src/components/credit-cas';
import RankHistory from '@/src/components/rank-history';
import { useScreenSize } from '@/src/hooks';
import { useCreditStore } from '@/src/store/credit';
import { typography } from '@/src/theme';
import { $Z_INDEXES } from '@/src/theme/variable';
import { StyleSheet, dp2px } from '@/src/utils';
import { reportClick, reportDiy, reportExpo } from '@/src/utils/report';
import { Image } from '@Components/image';
import { Screen } from '@Components/screen';
import { useShallow } from 'zustand/react/shallow';

const LIGHTNING = require('@Assets/image/credit/lightning.png');
const BATTERY = require('@Assets/image/credit/battery.png');
const FULL_BATTERY = require('@Assets/image/credit/full-battery.png');
const NO_BATTERY = require('@Assets/image/credit/no-battery.png');
const HALO = require('@Assets/image/credit/halo.png');

export default function Credit() {
  const router = useRouter();

  const screen = useScreenSize();

  useEffect(() => {
    reportDiy('credit', 'all-expo');
  }, []);

  const goRule = () => {
    reportClick('rule-entrance_button');
    showConfirm({
      title: '狸电池规则',
      modalStyle: {
        width: screen.width < 375 ? dp2px(screen.width - 72) : 303
      },
      content: (
        <View
          style={{
            paddingTop: 10,
            width: '100%',
            flexDirection: 'column'
          }}
        >
          <Text style={[$ruleContent, $bold]}>1、狸电池有什么用途？</Text>
          <Text style={$ruleContent}>
            狸电池可以用来炖图。更多的功能和玩法即将开放！
          </Text>
          <Text style={[$ruleContent, $bold]}>2、如何获得狸电池？</Text>
          <Text style={$ruleContent}>
            每日登录、充电任务可以获得大量狸电池，详情请在充电任务界面查看。
          </Text>
          <Text style={$ruleContent}>
            你的作品被拍同款、平行世界剧本被续写，也会获得狸电池奖励哦。
          </Text>
        </View>
      ),
      cancelText: '知道了',
      maskClose: true
    });
  };

  const insets = useSafeAreaInsets();

  const { totalCredits } = useCreditStore(
    useShallow(state => ({
      totalCredits: state.totalCredits
    }))
  );

  return (
    <Screen
      title="狸电站"
      theme="dark"
      safeAreaEdges={['bottom', 'top']}
      screenStyle={{
        backgroundColor: '#121212'
      }}
      backButton={false}
      headerRight={() => (
        <TouchableOpacity onPressIn={goRule}>
          <Text style={$ruleText}>规则</Text>
        </TouchableOpacity>
      )}
      headerLeft={() => (
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Icon
            icon="back"
            size={24}
            style={{
              tintColor: '#fff'
            }}
          ></Icon>
        </TouchableOpacity>
      )}
    >
      <View style={{ pointerEvents: 'none' }}>
        <Image
          style={[
            $lightning,
            {
              top: dp2px(-96),
              left: dp2px(-12)
            }
          ]}
          source={LIGHTNING}
          contentFit="fill"
        ></Image>
      </View>
      <View>
        <View style={$mine} key={'mine'}>
          {totalCredits < CREDIT_LIMIT ? (
            <Icon icon="credit_minus"></Icon>
          ) : (
            <Icon icon="credit_plus"></Icon>
          )}
          <Text style={$mineText}>我的狸电池</Text>
        </View>
        <Text
          style={[
            $total,
            {
              color: totalCredits < CREDIT_LIMIT ? '#FF6A3B' : '#11BB2C'
            }
          ]}
          key={'totalCredits'}
        >
          {totalCredits}
        </Text>
        <View
          style={[
            {
              top: dp2px(-82),
              left: 0,
              pointerEvents: 'none'
            }
          ]}
        >
          <Image
            source={
              totalCredits <= 60
                ? NO_BATTERY
                : totalCredits >= 300
                  ? FULL_BATTERY
                  : BATTERY
            }
            contentFit="fill"
            style={$battery}
          ></Image>
          <Image style={[$halo]} source={HALO} contentFit="fill"></Image>
        </View>
        <View style={{ paddingHorizontal: 16, marginBottom: 40 }}>
          <RankHistory />
        </View>
      </View>
    </Screen>
  );
}

const $ruleText: TextStyle = {
  color: '#FFF',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 16,
  fontWeight: '500',
  lineHeight: 22
};

const $ruleContent: TextStyle = {
  color: 'rgba(0, 0, 0, 0.87)',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 13,
  fontWeight: '400',
  lineHeight: 22
};

const $lightning: ImageStyle = {
  width: dp2px(236),
  height: dp2px(313),
  position: 'absolute'
};

const $halo: ImageStyle = {
  width: dp2px(261),
  height: dp2px(261),
  position: 'absolute',
  bottom: dp2px(-172),
  right: dp2px(-21),
  borderRadius: 261,
  zIndex: $Z_INDEXES.zm1
};

const $mine: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: dp2px(30),
  paddingTop: dp2px(42)
};

const $mineText: TextStyle = {
  color: 'rgba(255, 255, 255, 0.54)',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 18,
  fontWeight: '500',
  marginLeft: dp2px(7)
};

const $battery: ImageStyle = {
  position: 'absolute',
  width: dp2px(150),
  height: dp2px(150),
  right: dp2px(23),
  bottom: dp2px(-92)
};

const $total: TextStyle = {
  color: StyleSheet.currentColors.brand1,
  fontFamily: typography.fonts.wishcard,
  fontSize: 38,
  fontWeight: '400',
  paddingLeft: dp2px(30),
  marginBottom: dp2px(26)
};

const $bold: TextStyle = {
  fontWeight: '800',
  marginTop: 10
};
