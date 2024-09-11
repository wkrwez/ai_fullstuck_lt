import { BlurView } from 'expo-blur';
import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ShareInfoProps } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { Image } from '@Components/image';
import { Text } from '@Components/text';

interface ShareScreenProps {
  shareInfo: ShareInfoProps;
}

const LOGO1 = require('@Assets/brand/logo.png');
const LOGO2 = require('@Assets/brand/logo2.png');
const LOGO3 = require('@Assets/image/detail/share-xiaoli.png');
const SLOGAN = require('@Assets/brand/slogan.png');

const logoStyle = StyleSheet.create({
  $wrap: {
    marginTop: 60,
    left: 0,
    right: 0,
    justifyContent: 'center',
    gap: 9
  },
  $logo1: {
    width: 28,
    height: 28
  },
  $logo2: {
    width: 40,
    height: 20
  }
});

function Logo() {
  return (
    <View style={[StyleSheet.rowStyle, logoStyle.$wrap]}>
      <Image source={LOGO1} style={logoStyle.$logo1}></Image>
      <Image source={LOGO2} style={logoStyle.$logo2}></Image>
    </View>
  );
}

const imageStyle = StyleSheet.create({
  $card: {
    position: 'relative',
    marginTop: 20,
    marginLeft: 33,
    marginRight: 33,
    width: 308,
    height: 492,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 15,
    marginBottom: 36
  },
  $image: {
    width: '100%',
    height: 408,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  $bottom: {
    width: '100%',
    height: 84,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.3)
  },
  $bottomDec: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 63,
    height: 63
  },
  $grid: {
    ...StyleSheet.rowStyle,
    gap: 10,
    padding: 12
  },
  $qrcodeCont: {
    ...StyleSheet.centerStyle,
    backgroundColor: StyleSheet.currentColors.white,
    borderRadius: 6,
    width: 60,
    height: 60,
    opacity: 0.7
  },
  $titleWrap: {
    ...StyleSheet.rowStyle,
    gap: 4
  },
  $avatar: {
    width: 14,
    height: 14,
    borderRadius: 14
  },
  $title: {
    color: StyleSheet.hex(StyleSheet.currentColors.white, 0.9),
    fontSize: 10,
    fontWeight: '500'
  },
  $titleText: {
    color: StyleSheet.hex(StyleSheet.currentColors.white, 0.9),
    fontSize: 13,
    fontWeight: '600',
    width: 154
  },
  $decText: {
    color: StyleSheet.hex(StyleSheet.currentColors.white, 0.4),
    fontSize: 10,
    fontWeight: '500'
  },
  $slogan: {
    width: 174,
    height: 24
  }
});

export function DetailShareScreen(props: ShareScreenProps) {
  const info = useMemo(() => {
    if (!props?.shareInfo?.extra) return;
    return JSON.parse(props?.shareInfo?.extra);
  }, [props.shareInfo]);
  const imageUrl = useMemo(() => {
    const { imageIndex, images } = props.shareInfo.shareInfo;
    return images[imageIndex - 1];
  }, [props.shareInfo]);
  if (!info) return null;
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#ffffff' }]}>
      <Image
        style={[StyleSheet.absoluteFill]}
        source={imageUrl}
        tosSize="size1"
      />
      <BlurView intensity={80} style={[StyleSheet.absoluteFill]}></BlurView>
      <Logo />
      <View style={imageStyle.$card}>
        <View style={[imageStyle.$image]}>
          <Image
            style={[StyleSheet.absoluteFill, { resizeMode: 'cover' }]}
            source={imageUrl}
            tosSize="size1"
          />
        </View>
        <View style={imageStyle.$bottom}>
          <Image style={imageStyle.$bottomDec} source={LOGO3} />
          <View style={imageStyle.$grid}>
            <View style={imageStyle.$qrcodeCont}>
              <QRCode
                value={props.shareInfo.shareInfo.url}
                size={imageStyle.$qrcodeCont.width * 0.7}
                logoBackgroundColor="transparent"
              />
            </View>
            <View>
              <View style={imageStyle.$titleWrap}>
                <Image
                  style={imageStyle.$avatar}
                  source={info.avatar}
                  tosSize="size6"
                ></Image>
                <Text style={imageStyle.$title}>{info.name}</Text>
              </View>
              <Text
                numberOfLines={1}
                style={imageStyle.$titleText}
                ellipsizeMode="tail"
              >
                {props.shareInfo.shareInfo.title}
              </Text>
              <Text style={imageStyle.$decText}>长按查看更多内容</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[StyleSheet.rowStyle, StyleSheet.centerStyle]}>
        <Image
          source={SLOGAN}
          style={[imageStyle.$slogan, { resizeMode: 'center' }]}
        />
      </View>
    </View>
  );
}
