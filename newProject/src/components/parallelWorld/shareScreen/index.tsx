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

const SHARE_BG = require('@Assets/image/parallel-world/share-bg.jpg');
const SHARE_TOP_DEC = require('@Assets/image/parallel-world/share-top.png');
const SHARE_BOTTOM_DEC = require('@Assets/image/parallel-world/share-bottom.png');

const LOGO2 = require('@Assets/brand/logo2.png');
const LOGO3 = require('@Assets/image/detail/share-xiaoli.png');
const SLOGAN = require('@Assets/brand/slogan.png');

const imageStyle = StyleSheet.create({
  $wrap: {
    backgroundColor: '#1c252e',
    width: '100%',
    height: 748
  },
  $imageWrap: {
    position: 'absolute',
    left: 27.5,
    top: 119.3,
    width: 319,
    height: 425,
    overflow: 'hidden'
  },
  $decTop: {
    position: 'absolute',
    width: 135,
    height: 68,
    top: 79,
    left: 4
  },
  $decBot: {
    position: 'absolute',
    width: 100,
    height: 114,
    right: 0,
    top: 495
  },
  $image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  $infoWrap: {
    ...StyleSheet.rowStyle,
    padding: 12,
    gap: 12,
    position: 'absolute',
    top: 554,
    left: 28,
    width: 318,
    height: 100
  },
  $qrcodeCont: {
    ...StyleSheet.centerStyle,
    width: 76,
    height: 76,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
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
    color: StyleSheet.currentColors.textGray,
    fontWeight: '500',
    fontSize: 10
  },
  $titleText: {
    textAlign: 'justify',
    lineHeight: 15,
    color: '#222222',
    fontSize: 11,
    fontWeight: '600'
  }
});

export function WorldShareScreen(props: ShareScreenProps) {
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
    <View style={[StyleSheet.absoluteFill, imageStyle.$wrap]}>
      <Image source={SHARE_BG} style={StyleSheet.absoluteFill} />
      <View style={imageStyle.$imageWrap}>
        <Image style={imageStyle.$image} source={imageUrl} tosSize="size1" />
      </View>
      <View style={imageStyle.$decTop}>
        <Image style={imageStyle.$image} source={SHARE_TOP_DEC} />
      </View>
      <View style={imageStyle.$decBot}>
        <Image style={imageStyle.$image} source={SHARE_BOTTOM_DEC} />
      </View>
      <View style={imageStyle.$infoWrap}>
        <View style={imageStyle.$qrcodeCont}>
          <QRCode
            value={props.shareInfo.shareInfo.url}
            size={imageStyle.$qrcodeCont.width * 0.7}
            logoBackgroundColor="transparent"
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={imageStyle.$titleWrap}>
            <Image
              style={imageStyle.$avatar}
              source={info.avatar}
              tosSize="size6"
            ></Image>
            <Text style={imageStyle.$title}>{info.name}</Text>
          </View>
          <Text
            numberOfLines={3}
            style={imageStyle.$titleText}
            ellipsizeMode="tail"
          >
            {props.shareInfo.shareInfo.description}
          </Text>
        </View>
      </View>
      {/* <Image
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
      </View> */}
    </View>
  );
}
