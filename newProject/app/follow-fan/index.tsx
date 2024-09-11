import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { feedClient } from '@/src/api';
import { FullScreen, Icon, Tabs } from '@/src/components';
import { useSafeAreaInsetsStyle } from '@/src/hooks';
import { useAppStore } from '@/src/store/app';
import { catchErrorLog } from '@/src/utils/error-log';
import { reportExpo } from '@/src/utils/report';
import { StyleSheet } from '@Utils/StyleSheet';
import { useShallow } from 'zustand/react/shallow';
import { FansList, FollowList } from './components';

const items = [
  {
    key: 'follow',
    label: '关注'
  },
  {
    key: 'fans',
    label: '粉丝'
  }
];
export default () => {
  const { defaultTab = 'follow', uid } = useLocalSearchParams();

  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);
  const pagerRef = useRef<PagerView>(null);
  const [current, setCurrentTab] = useState<string>(defaultTab as string);
  const [stat, setStat] = useState<{ fans: number; followings: number }>({
    fans: 0,
    followings: 0
  });

  const { user } = useAppStore(
    useShallow(state => ({
      user: state.user
    }))
  );
  const isMine = useMemo(() => user?.uid === uid, [user, uid]);

  useEffect(() => {
    feedClient
      .userSocialInfo({ uid: uid as string })
      .then(res => {
        if (res.stat) {
          setStat({
            fans: Number(res.stat.fans),
            followings: Number(res.stat.followings)
          });
        }
      })
      .catch(e => {
        catchErrorLog('userSocialInfo_error', e, { params: { uid } });
      });
  }, [uid, current]);

  const onChangeTab = (key: string) => {
    setCurrentTab(key);
    pagerRef.current?.setPage(key === 'follow' ? 0 : 1);
  };

  useEffect(() => {
    if (current === 'follow') {
      reportExpo('follow', {
        identity_status: isMine ? '0' : '1'
      });
    }
    if (current === 'fan') {
      reportExpo('fan', {
        identity_status: isMine ? '0' : '1'
      });
    }
  }, [current, isMine]);

  const getContent = () => {
    return (
      <PagerView
        initialPage={defaultTab === 'follow' ? 0 : 1}
        ref={pagerRef}
        style={{ flex: 1 }}
        onPageSelected={e => {
          setCurrentTab(e.nativeEvent.position === 0 ? 'follow' : 'fans');
        }}
      >
        <View style={{ flex: 1 }}>
          <FollowList
            uid={uid as string}
            current={current}
            count={stat.followings}
            isMine={isMine}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FansList
            uid={uid as string}
            current={current}
            count={stat.fans}
            isMine={isMine}
          />
        </View>
      </PagerView>
    );
  };

  return (
    <FullScreen style={{ backgroundColor: StyleSheet.currentColors.white }}>
      <View style={[{ marginTop: $containerInsets.paddingTop }, st.header]}>
        <TouchableOpacity
          style={st.back}
          onPress={() => {
            router.back();
          }}
        >
          <Icon icon="back"></Icon>
        </TouchableOpacity>
        {/* <Animated.View style={[]}> */}
        <Tabs
          style={tabStyles.$tabStyle}
          itemStyle={tabStyles.$tabItemStyle}
          itemTextStyle={tabStyles.$tabItemTextStyle}
          activeTextStyle={tabStyles.$tabActiveStyle}
          items={items}
          current={current}
          onChange={onChangeTab}
          activeNode={
            <View style={tabStyles.$tabActiveBorder}>
              <View
                style={{
                  backgroundColor: StyleSheet.currentColors.brand1,
                  width: 24,
                  height: 2,
                  borderRadius: 500
                }}
              ></View>
            </View>
          }
        />
        {getContent()}
        {/* </Animated.View> */}
      </View>
    </FullScreen>
  );
};

const st = StyleSheet.create({
  header: {
    position: 'relative',
    flex: 1
  },
  back: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 10
  }
});

const tabStyles = StyleSheet.create({
  $tabStyle: {
    ...StyleSheet.rowStyle,
    borderBottomWidth: 0.5,
    borderColor: '#E8E8E8',
    height: 44,
    width: '100%',
    justifyContent: 'center'
  },
  $tabItemStyle: {
    flex: 0,
    width: 60
  },
  $tabItemTextStyle: {
    textAlign: 'center',
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.4),
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 44
  },
  $tabActiveStyle: {
    color: '#222222'
  },
  $tabActiveBorder: {
    ...StyleSheet.rowStyle,
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: -13,
    justifyContent: 'center'
  }
});
