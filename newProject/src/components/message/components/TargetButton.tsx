import { router } from 'expo-router';
import { GameType } from '@/src/types';
import { reportClick } from '@/src/utils/report';
import { InboxMsg } from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';
import { BaseButton, ButtonProps } from './BaseButton';

type TargetButtonProps = {
  id?: string;
  url?: string;
  title?: string;
  gameType?: GameType;
  extra?: string;
  data: InboxMsg;
  reportType: string;
} & ButtonProps;
export function TargetButton(props: TargetButtonProps) {
  const {
    preset,
    size,
    textStyle,
    style,
    children,
    id,
    url,
    gameType,
    title,
    extra
    // icon,
    // iconsize
  } = props;
  function toLink() {
    if (url) {
      if (url[0] === '/') {
        // @ts-ignore todo
        router.push(url);
        return;
      }
      router.push({
        pathname: '/webview',
        params: {
          url,
          title: title || ''
        }
      });
    } else if (id) {
      if (props.gameType === GameType.WORLD) {
        router.push({
          pathname: `/parallel-world/${id}`
        });
      } else {
        router.push({
          pathname: `/detail/${id}`,
          params: {
            id,
            ...(extra ? JSON.parse(extra) : {})
          }
        });
      }
    }
    reportClick('message_button', {
      type: props.reportType,
      messageid: props.data.msgId
    });
  }
  return (
    <BaseButton
      onPress={toLink}
      preset={preset}
      size={size}
      style={style}
      textStyle={textStyle}
    >
      {children}
    </BaseButton>
  );
}
