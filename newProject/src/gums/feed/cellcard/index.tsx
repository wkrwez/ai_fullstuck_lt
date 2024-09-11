import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import {
  Alert,
  ImageStyle,
  LayoutChangeEvent, // Image as NativeImage,
  Pressable,
  StyleProp,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SharedElement } from 'react-navigation-shared-element';
import { showToast } from '@/src/components';
import { BounceView } from '@/src/components/animation';
import { Avatar } from '@/src/components/avatar';
import { LikeStyle } from '@/src/components/like/LikeIcon';
import DotMarquee from '@/src/components/v2/dot-marquee';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { useDetailStore } from '@/src/store/detail';
import { typography } from '@/src/theme';
import { CommonColor } from '@/src/theme/colors/common';
import {
  $FEED_COLORS,
  $Z_INDEXES,
  $flex,
  $relative
} from '@/src/theme/variable';
import { StyleSheet } from '@/src/utils';
import { stirngRemoveEnter } from '@/src/utils/replace';
import { reportClick, reportExpo } from '@/src/utils/report';
import { Image } from '@Components/image';
import { DetailLike } from '@Components/like';
import { Text } from '@Components/text';
import { FeedRichCardInfo } from '@/app/feed/type';
import { EQUAL_INDEX } from '@/app/feed/waterfall/layout-utils';
import {
  ECellCardReportType,
  EWaterFallTabReportType,
  EWaterFallTabType
} from '@/app/feed/waterfall/type';
//注意用本地的
import { CardType, GameType } from '@step.ai/proto-gen/raccoon/common/types_pb';

const PARALLEL_MASK = require('@Assets/image/parallel-world/parallel-mask.png');
const PARALLEL_REACT = require('@Assets/image/parallel-world/parallel-react.png');

export enum CellCardScene {
  TOPIC_WORLD = 'topic_world',
  HOME = 'home',
  FOLLOW = 'follow',
  MY = 'my',
  LIKE = 'like',
  IP = 'ip'
}

export interface ICellCardProps {
  data: Partial<FeedRichCardInfo>;
  index?: number;
  emitHolderIndex?: (index: number) => void;
  reportParams?: Record<string, string | number | boolean | undefined>;
  // tab?: EWaterFallTabType;
  scene?: CellCardScene;
}

interface IWorldInfo {
  tag_id: number;
  world_name: string;
  world_num: string;
}

const VideoIcon = require('@Assets/image/feed/video_icon.png');
const GalleryIcon = require('@Assets/image/feed/gallery_icon.png');
const CardMaskIcon = require('@Assets/image/feed/card_mask.png');

const MemoCellCard =
  // memo(
  function CellCard({
    data,
    index,
    reportParams,
    emitHolderIndex,
    ...props
  }: ICellCardProps) {
    /**
     *  TODO: onload method
     */

    const handleOnLoad = () => {
      // opacityValue.value = withTiming(1, {
      //   easing: Easing.out(Easing.ease),
      //   duration: 60
      // });
    };

    const worldInfo: IWorldInfo = useMemo(
      () => JSON.parse(data.card?.extInfo || JSON.stringify('')),
      [data.card?.extInfo]
    );

    // console.log(data.card, '===inner', worldInfo, typeof worldInfo);

    const [measureWidth, setMeasureWidth] = useState(0);

    const getWorldNumLayout = (event: {
      nativeEvent: { layout: { width: any; height: any } };
    }) => {
      const { width, height } = event.nativeEvent.layout;
      setMeasureWidth(width + 70);
    };

    const reportLike = (isLiked: boolean) => {
      const { card, recExtraData } = data;
      const { gameId, id, brand, gameType, title, displayImageUrl } = card!;
      reportClick(
        'content_button',
        {
          contentid: id,
          card_order: index,
          traceid: recExtraData
            ? JSON.parse(recExtraData || JSON.stringify({}))?.trace_id
            : undefined,
          type: ECellCardReportType[gameType],
          ...reportParams
        },
        'like'
      );
    };

    const inner = () => {
      return (
        <>
          <View style={[$flex, $relative]}>
            <View
              style={[
                $flex,
                {
                  position: 'relative'
                }
              ]}
              onLayout={getWidth}
            >
              {/* <SharedElement id={`item.${data.card?.id}.photo`}> */}
              <Image
                onLoad={handleOnLoad}
                style={[{ opacity: 1, width: '100%', height: '100%' }]}
                source={data.card?.displayImageUrl || ''}
                contentPosition={
                  EQUAL_INDEX.includes(index === undefined ? -1 : index)
                    ? 'top'
                    : 'center'
                }
                tosSize="size2"
              />
              {data.card?.gameType === GameType.WORLD ? (
                <View style={$parallelWorld}>
                  <View style={$parallelWrapper}>
                    {props.scene !== CellCardScene.TOPIC_WORLD ? (
                      <Text style={$worldName} numberOfLines={1}>
                        {`${worldInfo?.world_name ? '《' + worldInfo?.world_name + '》' : ''}`}
                      </Text>
                    ) : null}
                    <View style={$worldArea}>
                      <Image
                        style={[
                          $worldMask,
                          {
                            width: measureWidth
                          }
                        ]}
                        source={PARALLEL_MASK}
                        contentFit="fill"
                      ></Image>
                      <Image style={$worldIcon} source={PARALLEL_REACT}></Image>
                      <Text style={$worldNum} onLayout={getWorldNumLayout}>
                        {worldInfo?.world_num}号
                      </Text>
                      <Text style={$worldAttr}>平行世界</Text>
                    </View>
                  </View>
                </View>
              ) : null}
              {/* </SharedElement> */}
              {SwitchView}
              <Image source={CardMaskIcon} style={$cardMask}></Image>
            </View>
          </View>
          {data?.card?.title && (
            <View style={$cardInfo}>
              <Text style={$title} ellipsizeMode="tail" numberOfLines={2}>
                {data.card?.title}
              </Text>
              <View style={$userInfo}>
                <View style={$avatar}>
                  <Avatar size={16} profile={data?.user}></Avatar>
                </View>
                <Text numberOfLines={1} style={$username}>
                  {data?.user?.name}
                </Text>
                <DetailLike
                  cardId={data.card?.id || ''}
                  liked={data.socialStat?.liked || false}
                  likeCount={Number(data.socialStat?.beingLikeds || 0)}
                  size={16}
                  style={{ top: 1 }}
                  likeIconStyle={LikeStyle.LINEAR}
                  activeColor={CommonColor.black40}
                  inactiveColor={CommonColor.black40}
                  fontStyle={{ fontSize: 11, lineHeight: 15, marginLeft: 3 }}
                  onLikeClicked={reportLike}
                />
              </View>
            </View>
          )}
        </>
      );
    };

    const holderSources = useMemo(
      () => data?.card?.resourceInfo?.resourceList || [],
      [data?.card?.resourceInfo]
    );

    const [holderIndex, setHolderIndex] = useState(0);
    const [activeSource, setActiveSource] = useState(
      holderSources[0]?.image?.url
    );
    const [activeSchema, setActiveSchema] = useState(
      holderSources[0]?.jumpSchema
    );
    const [singleWidth, setSingleWidth] = useState(0);
    const [singleHeight, setSingleHeight] = useState(0);

    const indexChange = (index: number) => {
      setHolderIndex(index);
      emitHolderIndex?.(index);
      setActiveSource(holderSources[index]?.image?.url);
      setActiveSchema(holderSources[index]?.jumpSchema);
      holderX.value = withTiming(-index * singleWidth, {
        duration: 250
      });
    };

    const getWidth = (e: LayoutChangeEvent) => {
      const layoutW = e.nativeEvent.layout.width;
      const hs = holderSources?.[0];
      const layoutH =
        layoutW / ((hs?.image?.width || 0) / (hs?.image?.height || 1));

      setSingleWidth(layoutW);
      setSingleHeight(layoutH);
    };

    const holderX = useSharedValue(0);

    const $holderTransStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: holderX.value
        }
      ]
    }));

    /**
     * 运营位跳转
     */
    const jumpSchema = useCallback(() => {
      const isH5 =
        activeSchema.includes('https') || activeSchema.includes('http');

      if (isH5) {
        router.push({
          pathname: '/webview',
          params: {
            url: activeSchema,
            title: ''
          }
        });
      } else {
        const schema = activeSchema;
        if (
          schema.includes('ip/') ||
          schema.includes('detail/') ||
          schema.includes('parallel-world/') ||
          schema.includes('topic/world/')
        ) {
          router.push({
            pathname: schema as RelativePathString
          });
        } else {
          // 端内统一登录拦截
          loginIntercept(
            () => {
              router.push({
                pathname: schema as RelativePathString
              });
            },
            { scene: LOGIN_SCENE.FEED_HOLDER }
          );
        }
      }
    }, [activeSchema]);

    const panGesture = Gesture.Pan();
    const THRESHOLD = 30;

    const holderOffseX = useSharedValue(0);
    const [autoLoop, setAutoLoop] = useState(true);
    const autoLoopTimer = useRef<NodeJS.Timeout>();

    panGesture
      .onStart(e => {
        holderOffseX.value = e.translationX;
        setAutoLoop(() => false);
      })
      .onUpdate(e => {
        holderOffseX.value = e.translationX;
      })
      .onEnd(e => {
        // 根据水平滑动距离来改变下标
        if (e.translationX < -THRESHOLD) {
          indexChange((holderIndex + 1) % holderSources.length);
        } else if (holderOffseX.value > THRESHOLD) {
          indexChange(
            holderIndex - 1 < 0 ? holderSources.length - 1 : holderIndex - 1
          );
        }

        clearTimeout(autoLoopTimer.current);
        autoLoopTimer.current = setTimeout(() => {
          setAutoLoop(() => true);
        }, 3000);

        holderOffseX.value = 0; // 重置偏移量
      });

    const SwitchView = useMemo(() => {
      switch (data.card?.type) {
        case CardType.IMAGE: {
          return <Image source={GalleryIcon} style={$gallery}></Image>;
        }
        case CardType.VIDEO: {
          return <Image source={VideoIcon} style={$video}></Image>;
        }
        case CardType.GAME: {
          return (
            <View style={$game}>
              {/* <View style={$online}></View>
              <Text style={$onlineNum}>人玩过</Text> */}
            </View>
          );
        }
        case CardType.OPERATION: {
          return (
            <GestureDetector gesture={panGesture}>
              <View style={[$fillLayer]}>
                <View style={[$holderLayer]}>
                  <Animated.View style={[$holderWrapper, $holderTransStyle]}>
                    {holderSources.map(hs => {
                      return (
                        <Pressable
                          style={{
                            pointerEvents: 'none',
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <Image
                            source={hs?.image?.url}
                            tosSize="size2"
                            style={{
                              width: '100%',
                              height: '100%'
                            }}
                            contentPosition={'center'}
                          ></Image>
                        </Pressable>
                      );
                    })}
                  </Animated.View>
                </View>
                {holderSources.length > 0 ? null : (
                  <Image source={CardMaskIcon} style={$cardMask}></Image>
                )}
                {holderSources.length > 1 ? (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 7,
                      height: 7,
                      zIndex: $Z_INDEXES.z20
                    }}
                  >
                    <DotMarquee
                      length={holderSources.length}
                      activeIndex={holderIndex}
                      autoLoop={autoLoop}
                      defaultColor="#ffffffcc"
                      highlightColor="#fff"
                      handleIndexChange={indexChange}
                    ></DotMarquee>
                  </View>
                ) : null}
              </View>
            </GestureDetector>
          );
        }
        default: {
          return <View></View>;
        }
      }
    }, [data.card?.type, activeSource, singleWidth, autoLoop, holderIndex]);

    const { loginIntercept } = useAuthState();

    return (
      <Pressable style={$container} onPress={onPress}>
        {data.isAppend && index === 0 ? (
          <BounceView style={{ flex: 1 }} duration={300} ratio={0.8}>
            {inner()}
          </BounceView>
        ) : (
          inner()
        )}
      </Pressable>
    );

    function onPress() {
      const { card, recExtraData } = data;
      if (!card) return;
      const { gameId, id, brand, gameType, title, displayImageUrl } = card;
      reportClick('content_button', {
        contentid: id,
        card_order: index,
        traceid: recExtraData
          ? JSON.parse(recExtraData || JSON.stringify({}))?.trace_id
          : undefined,
        type: ECellCardReportType[gameType],
        ...reportParams
      });

      const isHolder = data?.card?.resourceInfo;

      if (isHolder) {
        reportClick('resource_button', {
          resourceid: data?.card?.id,
          picid: activeSource,
          pic_order: holderIndex + ''
        });
        jumpSchema();
        return;
      }

      const { requestDetail, placeholder } = useDetailStore.getState();
      if (!gameId) {
        showToast('请求出错~');
        return;
      }

      if (!id) return;

      if (gameType === GameType.WORLD) {
        router.push({
          pathname: `/parallel-world/${id}`
        });
        return;
      }

      // 做预请求
      placeholder(data);
      requestDetail({ cardId: id, gameId, gameType, gameIp: brand });

      router.push({
        pathname: `/detail/${id}`,
        params: {
          cardId: id || '',
          gameId: gameId || '',
          gameType: gameType || '',
          title: title || '',
          displayImageUrl: displayImageUrl || ''
        }
      });
    }
  };
// , (oldProps, newProps) => {
//     return oldProps.data.displayImageUrl !== newProps.data.displayImageUrl
// })

export default MemoCellCard;

const $container: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  marginVertical: 2,
  marginHorizontal: 2,
  overflow: 'hidden',
  borderRadius: 8,
  backgroundColor: '#fff'
};

const $cardMask: ImageStyle = {
  width: '100%',
  height: 72,
  position: 'absolute',
  bottom: 0,
  opacity: 0.6
};

const $gallery: ImageStyle = {
  position: 'absolute',
  right: 9,
  bottom: 9,
  width: 21,
  height: 21,
  zIndex: 10
};

const $video: ImageStyle = {
  position: 'absolute',
  right: 9,
  bottom: 9,
  width: 21,
  height: 21,
  zIndex: 10
};

const $game: ImageStyle = {
  position: 'absolute',
  right: 9,
  bottom: 0,
  height: 21,
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  zIndex: $Z_INDEXES.z10
};

const $online: ViewStyle = {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: $FEED_COLORS.onlineColor
};

const $onlineNum: TextStyle = {
  fontSize: 9,
  marginLeft: 6,
  color: '#fff'
};

const $cardInfo: TextStyle = {
  paddingTop: 10,
  paddingBottom: 10,
  paddingHorizontal: 10
};

const $title: TextStyle = {
  fontFamily: 'PingFang SC',
  fontWeight: '500',
  color: '#222',
  fontSize: 13,
  lineHeight: 18,
  marginBottom: 6
};

const $userInfo: TextStyle = {
  alignItems: 'center',
  flexDirection: 'row'
};

const $avatar: ViewStyle = {
  width: 16,
  height: 16,
  borderRadius: 8,
  marginRight: 4,
  backgroundColor: '#eee'
};

const $username: TextStyle = {
  top: 1,
  flex: 1,
  fontSize: 10,
  lineHeight: 16,
  color: $FEED_COLORS.userNameColor
};

// TODO:

const $parallelWorld: ViewStyle = {
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
  paddingVertical: 10,
  paddingHorizontal: 10,
  justifyContent: 'center',
  flexDirection: 'column',
  zIndex: $Z_INDEXES.z100
};

const $parallelWrapper: ViewStyle = {
  flex: 1,
  position: 'relative'
};

const $worldName: TextStyle = {
  color: StyleSheet.colors.white,
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 11,
  fontWeight: '600',
  lineHeight: 16,
  display: 'flex'
};
const $worldArea: ViewStyle = {
  justifyContent: 'flex-start',
  display: 'flex',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  height: 30,
  position: 'relative',
  alignItems: 'center',
  paddingVertical: 8,
  paddingHorizontal: 8,
  minWidth: 70
};
const $worldIcon: ImageStyle = {
  width: 13,
  height: 13,
  marginRight: 4
};
const $worldMask: ImageStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: 30,
  minWidth: 70
};
const $worldNum: TextStyle = {
  color: '#377691',
  fontSize: 12,
  fontWeight: '400',
  lineHeight: 16,
  fontFamily: typography.fonts.world
};
const $worldAttr: TextStyle = {
  color: '#222',
  fontSize: 12,
  fontWeight: '400',
  lineHeight: 16,
  fontFamily: typography.fonts.world
};

const $fillLayer: StyleProp<ImageStyle> = {
  flex: 1,
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  justifyContent: 'center',
  alignItems: 'flex-end',
  flexDirection: 'row',
  zIndex: $Z_INDEXES.z10,
  width: '100%'
};

const $holderLayer: StyleProp<ImageStyle> = {
  position: 'absolute',
  top: 0,
  left: 0,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  width: '100%',
  height: '100%'
};

const $holderWrapper: ViewStyle = {
  // flex: 1,
  position: 'relative',
  flexDirection: 'row',
  width: '100%',
  height: '100%'
};
