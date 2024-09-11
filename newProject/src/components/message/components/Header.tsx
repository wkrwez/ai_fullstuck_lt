import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useDetailStore } from '@/src/store/detail';
import { GameType, RichCardInfo, UserProfile } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { Avatar } from '@Components/avatar';
import { Text } from '@Components/text';
import { IconTypes } from '../../icons';
import type { PartialMessage } from '@bufbuild/protobuf';
import { WorkMsg } from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';

interface HeaderProps {
  profile?: PartialMessage<UserProfile> | null;
  children?: ReactNode;
  icon?: IconTypes;
  title?: string;
  desc?: string;
  user?: UserProfile;
  gameType?: GameType;
  id?: string;
  url?: string;
  uid?: string;
  style?: StyleProp<ViewStyle>;
  onCard?: Function;
  extra?: string;
  work?: WorkMsg;
}

export function Header(props: HeaderProps) {
  // const { user } = useAppStore(
  //   useShallow(state => ({
  //     user: state.user
  //   }))
  // );
  const { title, url, id, uid, style, gameType, work } = props;

  function toLink() {
    const params = props.onCard && props.onCard();
    if (url) {
      router.push({
        pathname: '/webview',
        params: {
          url,
          title: title || '',
          ...params
        }
      });
    } else if (id) {
      if (gameType === GameType.WORLD) {
        router.push({
          pathname: `/parallel-world/${id}`,
          params: {
            id,
            ...params
          }
        });
      } else {
        if (work?.image) {
          const { placeholder } = useDetailStore.getState();
          placeholder({
            card: {
              id,
              displayImageUrl: work?.image
            }
          } as PartialMessage<RichCardInfo>);
        }

        router.push({
          pathname: `/detail/${id}`,
          params: {
            id,
            ...params,
            ...(props?.extra
              ? JSON.parse(props?.extra || JSON.stringify({}))
              : {})
          }
        });
      }
    } else if (uid) {
      router.push({
        pathname: `/user/${uid}`,
        params: {
          id: (uid || '').toString(),
          ...params
        }
      });
    }
  }

  return (
    <Pressable onPress={toLink}>
      <View style={[StyleSheet.rowStyle, st.$wrap, style]}>
        <View style={[StyleSheet.flex1Style, st.$wrapLeft]}>
          <Avatar profile={props.user} icon={props.icon} />
          <View style={st.$wrapCenter}>
            <Text style={st.$title} numberOfLines={1} ellipsizeMode="tail">
              {props.title}
            </Text>
            <Text style={st.$desc} numberOfLines={1} ellipsizeMode="tail">
              {props.desc}
            </Text>
          </View>
        </View>
        {props.children && <View>{props.children}</View>}
      </View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  $wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  $wrapLeft: {
    display: 'flex',
    flexDirection: 'row'
  },
  $wrapCenter: {
    marginLeft: 12,
    marginRight: 12,
    height: 42,
    display: 'flex',
    flex: 1
  },
  $title: {
    fontSize: 15,
    height: 21,
    marginTop: 4,
    marginBottom: 4,
    fontWeight: '500',
    lineHeight: 21,
    color: '#222222'
  },
  $desc: {
    fontFamily: 'PingFang SC',
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 12,
    height: 17,
    fontWeight: '400',
    lineHeight: 17
  }
});
