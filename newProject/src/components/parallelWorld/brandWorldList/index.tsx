import { router } from 'expo-router';
import { useRef } from 'react';
import {
  ImageStyle,
  Pressable,
  ScrollView,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { IOScrollView, InView } from 'react-native-intersection-observer';
import { typography } from '@/src/theme';
import { CommonColor, getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { reportClick, reportExpo } from '@/src/utils/report';
import { Image } from '@Components/image';
import { TriangleIcon } from '@/assets/image/svg';
import { AllRootWorldsResponse_Brand } from '@/proto-registry/src/web/raccoon/query/query_pb';

export const ITEM_BG = require('@Assets/image/parallel-world/center-world-item-bg.png');

export function IpSection({ brand }: { brand: AllRootWorldsResponse_Brand }) {
  const ipVisible = useRef<boolean>();
  const cardVisible = useRef<Record<string, boolean>>({});
  const gotoPlay = (id: string) => {
    if (id) {
      reportClick('script_card', {
        contentid: id,
        scriptid: id
      });
      router.push({
        // pathname: `/parallel-world/${id}`
        pathname: `/topic/world/${id}`
      });
    }
  };

  const reportExposure = (inView: boolean, id: string, title: string) => {
    if (inView) {
      const key = `${id}_${title}`;
      cardVisible.current[key] = true;
      calcReport();
    }
  };

  const onIpExposure = (inView: boolean) => {
    if (inView) {
      ipVisible.current = inView;
      calcReport();
    }
  };

  const calcReport = () => {
    if (ipVisible.current) {
      for (let key in cardVisible.current) {
        if (cardVisible.current[key]) {
          const info = key.split('_');
          reportExpo('script_card', {
            contentid: info[0],
            scriptid: info[0]
          });
          delete cardVisible.current[key];
        }
      }
    }
  };

  return (
    <InView style={$container} onChange={onIpExposure}>
      <View style={$brandInfoContainer}>
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 25,
            overflow: 'hidden',
            backgroundColor:
              brand.brandInfo?.bgColor || getThemeColor(Theme.DARK).eleBg
          }}
        >
          <Image
            source={brand.brandInfo?.iconUrl}
            style={{ width: '100%', height: '100%' }}
            tosSize="size6"
          ></Image>
        </View>
        <Text style={[$text, $brandText]}>{brand.brandInfo?.displayName}</Text>
      </View>
      <IOScrollView
        bounces={false}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={$worldsContainer}>
          {brand.worlds.map((item, index) => (
            <InView
              key={index}
              triggerOnce={true}
              onChange={inView =>
                reportExposure(inView, item.cardId, item.title)
              }
            >
              <Pressable onPress={() => gotoPlay(item.cardId)}>
                <View style={[$worldContainer]}>
                  <Image source={ITEM_BG} style={$worldImageBg} />
                  <Image
                    source={item.cover}
                    style={$worldImage}
                    tosSize="size2"
                  />
                  {/* <View style={$corner}>
                    <TriangleIcon
                      width={26}
                      height={26}
                      color={CommonColor.black40}
                    />
                  </View>
                  <Text style={[$text, $cornerText]}>{item.totalPlots}</Text> */}
                </View>

                <View style={$worldTextContainer}>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={2}
                    style={[$text, $worldText]}
                  >
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            </InView>
          ))}
        </View>
      </IOScrollView>
    </InView>
  );
}

const $container: ViewStyle = {
  width: '100%'
};

const $brandInfoContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
  alignItems: 'center',
  marginBottom: 10,
  paddingHorizontal: 20
};

const $text: TextStyle = {
  color: CommonColor.white
};

const $brandText: TextStyle = {
  fontFamily: typography.fonts.baba.bold,
  fontSize: 16,
  lineHeight: 25,
  height: 25,
  verticalAlign: 'middle'
};

const $worldText: TextStyle = {
  fontSize: 12,
  lineHeight: 16,
  padding: 3,
  width: '100%'
};

const $worldsContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
  alignItems: 'flex-start',
  marginBottom: 30,
  paddingHorizontal: 20,
  width: '100%'
};

const $worldContainer: ViewStyle = {
  width: 108,
  height: 140,
  marginBottom: 2
};

const $worldTextContainer: ViewStyle = {
  width: 108,
  height: 40
};

const $worldImage: ImageStyle = {
  position: 'absolute',
  top: 3,
  left: 3,
  right: 7,
  bottom: 7,
  borderWidth: 1,
  borderColor: CommonColor.white
};

const $worldImageBg: ImageStyle = {
  width: '100%',
  height: '100%'
};

const $corner: ViewStyle = {
  position: 'absolute',
  right: 7,
  bottom: 7
};

const $cornerText: TextStyle = {
  position: 'absolute',
  right: 10,
  bottom: 8,
  fontSize: 10
};
