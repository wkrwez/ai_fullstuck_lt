import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ImageStyle, Pressable, TextStyle, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { hex, typography } from '@/src/theme';
import { CommonColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { reportClick, reportExpo } from '@/src/utils/report';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { SkeletonColumn, SkeletonRow, SkeletonSpan } from '../../skeletion';
import { showToast } from '../../toast';
import { ArrowIcon } from '@/assets/image/svg';
import { RootWorldResponse } from '@/proto-registry/src/web/raccoon/query/query_pb';

const QUOTA = require('@Assets/image/topic/quota.png');

export function WorldTopicInfo({ info }: { info?: RootWorldResponse }) {
  const handler = () => {
    Clipboard.setStringAsync(JSON.stringify(info));
    showToast('已复制');
  };

  const longpressGesture = Gesture.LongPress().onEnd(e => {
    runOnJS(handler)();
  });

  const onClickComment = () => {
    reportClick('comment_button', {
      contentid: info?.topComment?.cardId,
      commentid: info?.topComment?.commentId
    });
    router.push(
      `/parallel-world/${info?.topComment?.cardId}?topCommentId=${info?.topComment?.commentId}`
    );
  };

  useEffect(() => {
    if (info?.topComment) {
      reportExpo('comment_button', {
        contentid: info.topComment.cardId,
        commentid: info.topComment.commentId
      });
    }
  }, [info]);

  return info ? (
    <View
      style={{
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 24
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <View
          style={{
            shadowColor: 'rgba(0, 0, 0, 0.20)',
            shadowOpacity: 1,
            shadowOffset: {
              height: 6,
              width: 2
            },
            shadowRadius: 8
          }}
        >
          <Image
            style={{
              width: 100,
              height: 128,
              borderRadius: 10
            }}
            contentFit="cover"
            source={info?.topic?.cover}
            tosSize="size2"
          />
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              weight="bold"
              size="lg"
              style={$infoTitle}
              color={CommonColor.white}
            >
              #{info?.topic?.name}
            </Text>
          </View>

          <GestureDetector gesture={longpressGesture}>
            <View
              style={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 16,
                backgroundColor: hex(CommonColor.white, 0.1),
                paddingHorizontal: 6,
                paddingVertical: 4,
                alignSelf: 'flex-start'
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                {info?.stat?.topUserAvatars.map(url => (
                  <Image
                    source={url}
                    contentFit="cover"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      borderColor: CommonColor.white,
                      backgroundColor: CommonColor.white,
                      borderWidth: 1,
                      marginRight: -6
                    }}
                    tosSize="size10"
                  />
                ))}
              </View>
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 10,
                  fontSize: 10,
                  marginRight: 4
                }}
                color="#fff"
              >
                已开启{info?.stat?.totalWorlds || 'xx'}条世界线
              </Text>
            </View>
          </GestureDetector>

          <View
            style={{
              marginTop: 8
            }}
          >
            <Text
              style={{
                fontSize: 12,
                lineHeight: 18
              }}
              numberOfLines={3}
              ellipsizeMode="tail"
              color={CommonColor.gray1}
            >
              {info?.world?.description || ''}
            </Text>
          </View>
        </View>
      </View>
      {info?.topComment ? (
        <Pressable
          style={{
            marginTop: 24,
            paddingTop: 14
          }}
          onPress={onClickComment}
        >
          <Image source={QUOTA} style={$quota} />
          <Text
            color={CommonColor.white}
            size="md"
            numberOfLines={3}
            ellipsizeMode="tail"
            style={$sourceHanSerifText}
          >
            {info?.topComment?.content}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 10
            }}
          >
            <Image
              source={info?.topComment?.avatar}
              style={{ width: 16, height: 16, borderRadius: 16, flex: 0 }}
              tosSize="size10"
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'nowrap',
                flex: 1,
                height: 16
              }}
            >
              <Text
                color={CommonColor.gray2}
                size="xxs"
                style={[$sourceHanSerifText, $quotaText]}
              >
                来自平行世界
              </Text>
              <Text
                color={CommonColor.gray2}
                size="xxs"
                style={[
                  $sourceHanSerifText,
                  $quotaText,
                  {
                    flexGrow: 0,
                    flexShrink: 1,
                    marginLeft: 4,
                    marginRight: 4
                  }
                ]}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {info?.topComment?.nickname}
              </Text>
              <Text
                color={CommonColor.gray2}
                size="xxs"
                style={[
                  $sourceHanSerifText,
                  $quotaText,
                  {
                    marginRight: 1
                  }
                ]}
              >
                的评论
              </Text>
              <ArrowIcon color={CommonColor.gray2} />
            </View>
          </View>
        </Pressable>
      ) : null}
    </View>
  ) : (
    <WorldTopicInfoSkeleton />
  );
}

const $infoTitle: TextStyle = {
  fontFamily: typography.fonts.baba.bold
};

const $quota: ImageStyle = {
  position: 'absolute',
  width: 50,
  height: 34
};

const $sourceHanSerifText: TextStyle = {
  fontFamily: typography.fonts.SourceHanSerif.bold
};

const $quotaText: TextStyle = {
  lineHeight: 16,
  height: 16,
  flex: 0
};

function WorldTopicInfoSkeleton() {
  return (
    <SkeletonColumn
      style={{
        paddingHorizontal: 20,
        paddingBottom: 24
      }}
      gap={16}
    >
      <SkeletonRow gap={16}>
        <SkeletonSpan theme={Theme.DARK} height={128} width={100} radius={10} />
        <SkeletonColumn gap={10} style={{ flex: 1 }}>
          <SkeletonSpan
            theme={Theme.DARK}
            height={28}
            width={'90%'}
            radius={10}
          />
          <SkeletonSpan
            theme={Theme.DARK}
            height={28}
            width={'80%'}
            radius={16}
          />
          <SkeletonSpan
            theme={Theme.DARK}
            height={50}
            width={'100%'}
            radius={10}
          />
        </SkeletonColumn>
      </SkeletonRow>
      <SkeletonSpan
        theme={Theme.DARK}
        height={106}
        width={'100%'}
        radius={10}
      />
    </SkeletonColumn>
  );
}
