import { router } from 'expo-router';
import { Pressable, TextStyle, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FollowBtnTheme } from '@/src/components/follow/type';
import { SHARE_DETAIL_URL } from '@/src/constants';
import { useScreenSize } from '@/src/hooks/useScreenSize';
import { useAppStore } from '@/src/store/app';
import { useDetailStore } from '@/src/store/detail';
import { StyleSheet } from '@/src/utils';
import { log } from '@/src/utils/logger';
import { stirngRemoveEnter } from '@/src/utils/replace';
import { reportClick } from '@/src/utils/report';
import { Avatar } from '@Components/avatar';
import { Follow } from '@Components/follow';
import { ShareButton } from '@Components/shareButton';
import { Text } from '@Components/text';
import { showToast } from '../../toast';
import { useShallow } from 'zustand/react/shallow';

const MOCK_IMG = require('@Assets/mock/img1.jpg');

// const { width: screenWidth } = useScreenSize('window');

const $headerWrapStyle: ViewStyle = {
  alignItems: 'center',
  marginLeft: 2
  // width: '100%'
};

const $headerTitleStyle: TextStyle = {
  fontSize: 14,
  lineHeight: 26,
  marginLeft: 8,
  maxWidth: 160,
  overflow: 'hidden',
  fontWeight: '500'
};

export function HeaderLeft({ detailId }: { detailId: string }) {
  const { detail, commonInfo } = useDetailStore(
    useShallow(state => {
      const info = state.getDetail(detailId);
      return {
        detail: info?.detail,
        commonInfo: info?.commonInfo
      };
    })
  );
  // console.log('detail----', detail?.photos);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        const id = commonInfo?.profile?.uid;
        reportClick('post_user', {
          detailId
        });
        if (id)
          router.push({
            pathname: `/user/${id}`
          });
      }}
      style={[StyleSheet.rowStyle, $headerWrapStyle]}
    >
      <Avatar profile={commonInfo?.profile} size={36} />
      <Text style={$headerTitleStyle} numberOfLines={1} ellipsizeMode="tail">
        {stirngRemoveEnter(commonInfo?.profile?.name) || '火影文学十级研究者'}
      </Text>
    </TouchableOpacity>
  );
}

export function HeaderRight({ detailId }: { detailId: string }) {
  const { detail, commonInfo, updateDetail, imageIndex } = useDetailStore(
    useShallow(state => {
      const info = state.getDetail(detailId);
      return {
        imageIndex: info?.imageIndex,
        detail: info?.detail,
        commonInfo: info?.commonInfo,
        updateDetail: state.updateDetail
      };
    })
  );
  const { user } = useAppStore(
    useShallow(state => ({
      user: state.user
    }))
  );

  if (!detail || !commonInfo) return null;

  // 未登陆的用户显示关注
  // 已登陆但是detail请求未加载完的用户，先不显示关注
  // detail加载完之后，再根据数据做显示
  const showFollow = !user || (user && commonInfo?.followed !== undefined);

  const { cardId, photos, title, text } = detail;
  const shareInfo = {
    title,
    description: text,
    images: photos.map(i => i.url),
    url: SHARE_DETAIL_URL + `?id=${cardId}`,
    imageIndex: imageIndex || 1
  };

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
          followed={!!commonInfo?.followed}
          beingFollowed={!!commonInfo?.beingFollowed}
          uid={commonInfo?.profile?.uid}
          style={{ marginRight: 12 }}
          theme={FollowBtnTheme.REGULAR}
          onUnfollow={() => onUpdatefollow(false)}
          onFollow={() => onUpdatefollow(true)}
        />
      ) : null}

      <ShareButton
        authorInfo={commonInfo.profile}
        detailId={detailId}
        shareInfo={shareInfo}
        disabled={detail.cardMetaAttrs?.['sharable'] === 'false'}
      />
    </View>
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
}
