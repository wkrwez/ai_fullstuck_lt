import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { FollowBtnTheme } from '@/src/components/follow/type';
import { SHARE_WORLD_URL } from '@/src/constants';
import { selectState } from '@/src/store/_utils';
import { useAppStore } from '@/src/store/app';
import { useDetailStore } from '@/src/store/detail';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { UserProfile } from '@/src/types';
import { ShareTemplateName } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { stirngRemoveEnter } from '@/src/utils/replace';
import { reportClick } from '@/src/utils/report';
import { Avatar } from '@Components/avatar';
import { Follow } from '@Components/follow';
import { ShareButton } from '@Components/shareButton';
import { Text } from '@Components/text';
import { useReset } from '../../_hooks/reset.hook';
import { abstractActStoryText, getAllActItemsText } from '../gen-card';
import {
  WorldAct,
  WorldInfo
} from '@/proto-registry/src/web/raccoon/world/common_pb';
import { TimelinePlot } from '@/proto-registry/src/web/raccoon/world/world_pb';
import { useShallow } from 'zustand/react/shallow';

const $headerWrapStyle: ViewStyle = {
  alignItems: 'center',
  marginLeft: -5
};

const st = StyleSheet.create({
  $title: {
    fontSize: 14,
    lineHeight: 26,
    marginLeft: 8,
    maxWidth: 160,
    overflow: 'hidden',
    fontWeight: '600'
  }
});

export function HeaderLeft({ detailId }: { detailId: string }) {
  const { timeline, activeTimelineSectionIdx } = useParallelWorldMainStore(
    state => selectState(state, ['timeline', 'activeTimelineSectionIdx'])
  );

  const { resetWorld } = useReset();

  const currentAuthor = useMemo(
    () => timeline[activeTimelineSectionIdx]?.author,
    [timeline, activeTimelineSectionIdx]
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        const id = currentAuthor?.uid;
        reportClick('post_user', {
          detailId
        });
        if (id) {
          router.push({
            pathname: `/user/${id}`
          });
        }
      }}
      style={[StyleSheet.rowStyle, $headerWrapStyle]}
    >
      <Avatar profile={currentAuthor} size={36} onGotoUserpage={resetWorld} />
      <Text
        style={[st.$title, { color: getThemeColor(Theme.DARK).fontColor }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {stirngRemoveEnter(currentAuthor?.name)}
      </Text>
    </TouchableOpacity>
  );
}

const useFollow = ({
  detailId,
  user,
  plotInfo
}: {
  detailId: string;
  user: UserProfile | null;
  plotInfo: TimelinePlot;
}) => {
  const { commonInfo, updateDetail } = useDetailStore(
    useShallow(state => {
      const info = state.getDetail(detailId);
      return {
        commonInfo: info?.commonInfo,
        updateDetail: state.updateDetail
      };
    })
  );

  function onUpdatefollow(followed: boolean) {
    reportClick('follow_button', { contentid: detailId, followed });
    updateDetail(detailId, {
      commonInfo: {
        ...commonInfo,
        followed
      }
    });
  }

  /* 关注相关逻辑 */
  // 未登陆的用户显示关注
  // 已登陆但是detail请求未加载完的用户，先不显示关注
  // detail加载完之后，再根据数据做显示
  const showFollow = !user || (user && plotInfo?.isFollowed !== undefined);

  return { onUpdatefollow, showFollow };
};

const useShare = ({
  worldInfo,
  acts,
  actIndex,
  cardId,
  plotInfo
}: {
  worldInfo: WorldInfo;
  actIndex: number;
  acts: WorldAct[];
  plotInfo: TimelinePlot;
  cardId: string;
}) => {
  // todo 落地页&分享图实现后需更新

  const shareImageUrl =
    SHARE_WORLD_URL +
    `?id=${cardId}&pid=${plotInfo?.plotId}&actid=${acts[actIndex]?.actId}`;

  const desc = useMemo(() => {
    const story = abstractActStoryText(acts[actIndex]?.actItems ?? []);

    const desc = story.length
      ? story
      : getAllActItemsText(acts[actIndex]?.actItems ?? [], '\n');

    return desc;
  }, [acts, actIndex]);

  // 分享信息
  const shareInfo = {
    // 待替换为剧本name
    title: worldInfo?.title ?? '',
    description: desc,
    url: shareImageUrl,
    // 待替换为当前的幕 index
    imageIndex: actIndex + 1,
    images: acts.map(item => item.image?.imageUrl || '')
  };
  return { shareInfo };
};

export function HeaderRight({ detailId }: { detailId: string }) {
  const {
    acts,
    isParallelWordGuideVisible,
    activeTimelineSectionIdx,
    timeline,
    actIndex,
    worldInfo
  } = useParallelWorldMainStore(
    useShallow(state =>
      selectState(state, [
        'acts',
        'isParallelWordGuideVisible',
        'activeTimelineSectionIdx',
        'timeline',
        'actIndex',
        'worldInfo'
      ])
    )
  );

  const currentPlotInfo = timeline[activeTimelineSectionIdx];

  const { user } = useAppStore(
    useShallow(state => ({
      user: state.user
    }))
  );

  // 点击关注按钮
  const { onUpdatefollow, showFollow } = useFollow({
    detailId,
    plotInfo: currentPlotInfo,
    user
  });

  // 分享所需信息
  const { shareInfo } = useShare({
    worldInfo,
    acts,
    actIndex,
    cardId: detailId,
    plotInfo: currentPlotInfo
  });

  if (!acts || !currentPlotInfo) return null;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      {showFollow ? (
        <Follow
          followed={currentPlotInfo?.isFollowed}
          beingFollowed={Boolean(currentPlotInfo?.beingFollowed)}
          uid={currentPlotInfo?.author?.uid}
          style={{ marginRight: 12 }}
          theme={FollowBtnTheme.SOLID_DARK_MODE}
          onUnfollow={() => onUpdatefollow(false)}
          onFollow={() => onUpdatefollow(true)}
        />
      ) : null}
      <ShareButton
        authorInfo={currentPlotInfo?.author}
        shareTemplateName={ShareTemplateName.world}
        shareInfo={shareInfo}
        theme={Theme.DARK}
        detailId={detailId}
        // 平行世界入口页无「分享图」
        allowShareImage={!isParallelWordGuideVisible}
      />
    </View>
  );
}
