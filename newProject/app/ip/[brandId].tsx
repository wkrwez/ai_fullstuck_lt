import Color from 'color';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, Image, Screen, Text, showToast } from '@/src/components';
import { RequestScene } from '@/src/components/infiniteList/typing';
import { WaterFall2 } from '@/src/components/waterfall/WaterFall2';
import { useRequestFeed } from '@/src/components/waterfall/useRequsetFeed';
import { IP_GUIMIE, IP_IMAGE_BACK, IP_MASK, LOGO_TEXT } from '@/src/constants';
import { useSafeBottomArea } from '@/src/hooks';
import { useBrandStore } from '@/src/store/brand';
import { typography } from '@/src/theme';
import { StyleSheet } from '@/src/utils';
import { lightenColor, opacityColor } from '@/src/utils/color';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { RecSceneName } from '../feed/type';
import { BrandInfo } from '@/proto-registry/src/web/raccoon/common/showcase_pb';
import { useShallow } from 'zustand/react/shallow';

export default function IpDetailScreen() {
  const brandId = parseInt(useLocalSearchParams().brandId as string, 10);
  const [branInfo, setBrandInfo] = useState<BrandInfo | null>();
  const { getBrandInfo } = useBrandStore(
    useShallow(state => ({
      getBrandInfo: state.getBrandInfo,
      brandInfos: state.brandInfos
    }))
  );

  const { sourceData, loading, error, hasMore, fetchList } = useRequestFeed({
    defaultFetch: true,
    requestParams: {
      brand: brandId,
      recSceneName: RecSceneName.IP_LANDING
    },
    onError: scene =>
      scene === RequestScene.REFRESHING
        ? showToast('刷新失败啦，请重试')
        : undefined
  });

  const $safePaddingBottom = useSafeBottomArea();

  useEffect(() => {
    if (typeof brandId !== 'number') return router.back();
    getBrandInfo(brandId).then(branInfo => {
      setBrandInfo(branInfo);
    });
  }, [brandId]);

  const frontColor = lightenColor(branInfo?.bgColor || '#19321C', 6);

  return (
    <Screen
      title=""
      headerStyle={{
        borderBottomWidth: 0
      }}
      backButton={
        <Icon
          onPress={() => {
            router.back();
          }}
          icon="back"
          size={24}
          color="#fff"
        />
      }
      safeAreaEdges={['top']}
      backgroundView={
        <>
          <Image
            source={
              formatTosUrl(branInfo?.detailBgImgUrl || '', { size: 'size1' }) ||
              IP_MASK
            }
            style={{
              height: 270,
              left: 0,
              right: 0,
              position: 'absolute'
            }}
          />
          <LinearGradient
            style={{
              height: 320,
              left: 0,
              right: 0,
              position: 'absolute'
            }}
            colors={[
              opacityColor(lightenColor(branInfo?.bgColor || '#19321C'), 0.9),
              opacityColor(
                lightenColor(branInfo?.bgColor || '#19321C') || '#19321C',
                1
              ),
              opacityColor(
                lightenColor(branInfo?.bgColor || '#19321C') || '#19321C',
                1
              )
            ]}
          />
        </>
        // <View
        //   style={{
        //     backgroundColor: 'red',
        //     height: 270,
        //     left: 0,
        //     right: 0,
        //     position: 'absolute'
        //   }}
        // ></View>
      }
    >
      <View
        style={{
          marginTop: -12,
          marginBottom: 24,
          paddingHorizontal: 16,
          flexDirection: 'row'
        }}
      >
        <View>
          <IPBrand uri={branInfo?.landingIcon || ''} color={frontColor} />
        </View>
        <View style={{ flex: 1, marginLeft: 16, marginTop: 12 }}>
          <View>
            <Text weight="bold" style={$ipName} color="#fff">
              {branInfo?.displayName || '---'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Icon size={24} style={{ top: -4 }} icon="xl_hand"></Icon>
            <Text
              weight="bold"
              style={{
                fontWeight: '900',
                marginBottom: 4,
                fontSize: 12
              }}
              color="rgba(255, 255, 255, 0.9)"
            >
              {'小狸奇遇记：'}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between'
            }}
          >
            <Text
              style={{
                fontSize: 12
              }}
              numberOfLines={3}
              color="rgba(255, 255, 255, 0.9)"
            >
              {branInfo?.description || '...'}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingTop: 8,
          backgroundColor: '#F5F5F5'
        }}
      >
        <WaterFall2
          data={sourceData}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onRequest={fetchList}
          footerStyle={{ paddingBottom: $safePaddingBottom }}
        />
      </View>
    </Screen>
  );
}

// 仅IP页使用，后续再挪动
const IPBrand = ({
  uri,
  color = '#264D2A'
}: {
  uri: string;
  color: string;
}) => {
  return (
    <View
      style={{
        width: 118
      }}
    >
      <Image
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 64,
          width: 118
        }}
        source={IP_IMAGE_BACK}
        tintColor={color}
      ></Image>
      <Image
        source={formatTosUrl(uri, { size: 'size4' }) || IP_GUIMIE}
        style={{
          left: -4,
          width: 126,
          height: 138
        }}
      ></Image>
    </View>
  );
};

const $ipName: TextStyle = {
  color: StyleSheet.colors.white,
  fontFamily: typography.fonts.baba.heavy,
  fontSize: 20,
  fontWeight: '800',
  lineHeight: 23,
  marginBottom: 12
};
