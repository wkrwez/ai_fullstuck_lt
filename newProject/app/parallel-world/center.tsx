import { useEffect, useState } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { IOScrollView } from 'react-native-intersection-observer';
import { feedClient } from '@/src/api';
import { Icon, Image, Screen } from '@/src/components';
import { EmptyPlaceHolder } from '@/src/components/Empty';
import { IpSection } from '@/src/components/parallelWorld/brandWorldList';
import {
  SkeletonCircle,
  SkeletonColumn,
  SkeletonRow,
  SkeletonSpan
} from '@/src/components/skeletion';
import { useSafeBottomArea } from '@/src/hooks';
import { CommonColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { logWarn } from '@/src/utils/error-log';
import { reportExpo } from '@/src/utils/report';
import { Text } from '@Components/text';
import { AllRootWorldsResponse_Brand } from '@/proto-registry/src/web/raccoon/query/query_pb';

export const PAGE_BG = require('@Assets/image/parallel-world/center-bg.png');

export default function ParallelWorldCenter() {
  const [wpConfig, setWpConfig] = useState<
    AllRootWorldsResponse_Brand[] | null
  >();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const $bottom = useSafeBottomArea();

  const initPageData = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await feedClient.allRootWorlds();
      setWpConfig(res.brands);
    } catch (error) {
      logWarn('parallelWorldGetAllRootWorldsError', error);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    initPageData();
    setTimeout(() => {
      reportExpo('page_expo');
    });
  }, []);

  return (
    <Screen
      // ScrollViewComp={IOScrollView}
      theme="dark"
      preset="fixed"
      safeAreaEdges={['top']}
      headerTitle={() => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center'
          }}
        >
          <Icon icon="pw_icon_white" size={18} />
          <Text
            preset="bold"
            size="md"
            numberOfLines={1}
            style={{ color: CommonColor.white }}
          >
            平行世界
          </Text>
        </View>
      )}
      headerStyle={{
        borderBottomWidth: 0
      }}
      backgroundView={
        <Image
          source={PAGE_BG}
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            position: 'absolute'
          }}
        />
      }
    >
      {error ? (
        <View style={$pageContainerStyle}>
          <EmptyPlaceHolder theme={Theme.DARK}>找不到啦</EmptyPlaceHolder>
        </View>
      ) : loading ? (
        <View style={$pageContainerStyle}>
          <ParallelWorldCenterSkeleton />
        </View>
      ) : wpConfig?.length ? (
        <IOScrollView
          showsVerticalScrollIndicator={false}
          style={[$pageContainerStyle]}
        >
          <View
            style={[
              {
                width: '100%',
                marginBottom: $bottom
              }
            ]}
          >
            {wpConfig.map(item => (
              <IpSection key={item.brandInfo?.brand} brand={item} />
            ))}
          </View>
        </IOScrollView>
      ) : (
        <View style={$pageContainerStyle}>
          <EmptyPlaceHolder theme={Theme.DARK}>暂无内容</EmptyPlaceHolder>
        </View>
      )}
    </Screen>
  );
}

function ParallelWorldCenterSkeleton() {
  return (
    <SkeletonColumn style={$skeletonContainerStyle} repeat={3} gap={50}>
      <SkeletonColumn>
        <SkeletonRow>
          <SkeletonCircle theme={Theme.DARK} size={26} />
          <SkeletonSpan theme={Theme.DARK} height={26} width={98} radius={4} />
        </SkeletonRow>
        <SkeletonRow repeat={4}>
          <SkeletonColumn>
            <SkeletonSpan
              theme={Theme.DARK}
              height={130}
              width={98}
              radius={4}
            />
            <SkeletonSpan
              theme={Theme.DARK}
              height={20}
              width={98}
              radius={4}
            />
          </SkeletonColumn>
        </SkeletonRow>
      </SkeletonColumn>
    </SkeletonColumn>
  );
}

const $pageContainerStyle: ViewStyle = {
  paddingTop: 10,
  width: '100%',
  height: '100%'
};

const $skeletonContainerStyle: ViewStyle = {
  paddingLeft: 20
};
