import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useAuthState } from '@/src/hooks';
import { useProfileStore } from '@/src/store/profile';
import { useUserInfoStore } from '@/src/store/userInfo';
import { StyleSheet } from '@/src/utils';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { reportClick } from '@/src/utils/report';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { IconTypes } from '../icons';
import { Icon } from '../icons';
import { size } from '../makePhotoV2/optionList/constant';
import { UserProfile } from '@/proto-registry/src/web/raccoon/common/profile_pb';
import type { PartialMessage } from '@bufbuild/protobuf';
import { useShallow } from 'zustand/react/shallow';

const DEFAULT_ATATAR = require('@Assets/user/default_avatar.png');

type AvatarProps = {
  profile?: PartialMessage<UserProfile> | null;
  size?: number;
  source?: string;
  icon?: IconTypes;
  onGotoUserpage?: () => void;
};
export function Avatar(props: AvatarProps) {
  return (
    <Pressable
      onPress={gotoRoute}
      style={{
        width: props.size || 50,
        height: props.size || 50,
        // overflow: 'hidden',
        ...StyleSheet.circleStyle
      }}
    >
      <Image
        source={
          formatTosUrl(props.profile?.avatar || props.source || '', {
            size: 'size10'
          }) || DEFAULT_ATATAR
        }
        style={{ width: '100%', height: '100%', borderRadius: 500 }}
      ></Image>
      {props.icon && (
        <Icon
          icon={props.icon}
          style={{ position: 'absolute', right: 0, bottom: 0 }}
        ></Icon>
      )}
    </Pressable>
  );

  function gotoRoute() {
    // loginIntercept(async () => {
    const id = props.profile?.uid;
    props.onGotoUserpage?.();
    // console.log(`props.profile?.uid`, props.profile?.uid);
    // const { request, placeholder } = useProfileStore.getState();
    // if (props.profile) {
    //   placeholder(props.profile);
    // }
    // request(id || '');
    if (id) useUserInfoStore.getState().syncUserInfo(id);

    const idstr = (props.profile?.uid || '').toString();
    router.push({
      pathname: `/user/${idstr}`,
      params: {
        // todo 临时兼容
        id: (props.profile?.uid || '').toString()
      }
    });
    // });
  }
}
