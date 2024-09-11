import { ShareInfoProps, ShareTemplateName } from '@/src/types';
import { DetailShareScreen } from '@Components/detail/shareScreen';
import { WorldShareScreen } from '@Components/parallelWorld/shareScreen';

interface ShareScreenProps {
  shareInfo: ShareInfoProps;
}
export function ShareScreen(props: ShareScreenProps) {
  if (props.shareInfo.shareTemplateName === ShareTemplateName.detail) {
    return <DetailShareScreen {...props} />;
  }
  if (props.shareInfo.shareTemplateName === ShareTemplateName.world) {
    return <WorldShareScreen {...props} />;
  }
  return <DetailShareScreen {...props} />;
}
