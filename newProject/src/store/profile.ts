/** 用户profile */
import { create } from 'zustand';
import { GetUserCommonInfo } from '@/src/api/query';
import { showToast } from '@Components/toast';
import { catchErrorLog, logWarn } from '@Utils/error-log';
import type { PartialMessage } from '@bufbuild/protobuf';
import { UserProfile } from '@step.ai/proto-gen/raccoon/common/profile_pb';
import { UserSocialStat } from '@step.ai/proto-gen/raccoon/common/stat_pb';

type States = {
  uid: string | null;
  profile: PartialMessage<UserProfile> | null;
  stat: UserSocialStat | null;
  profiles: { profile: UserProfile; stat: UserSocialStat }[];
  loading: boolean;
};

type Actions = {
  request: (uid: string) => void;
  placeholder: (payload: PartialMessage<UserProfile>) => void;
  reset: () => void;
};

export const useProfileStore = create<States & Actions>()((set, get) => ({
  uid: null,
  profiles: [],
  profile: null,
  stat: null,
  loading: false,
  reset() {
    set({
      uid: null,
      profile: null,
      stat: null
    });
  },
  sync(uid: string) {},
  placeholder(profile) {
    set({
      profile
    });
  },
  request(uid: string) {
    set({
      loading: true
    });
    console.log('[GetUserCommonInfo]', uid);
    GetUserCommonInfo({ uid })
      .then(({ profile, stat }) => {
        console.log('[GetUserCommonInfo] profile', profile);

        set({
          profile,
          stat,
          loading: false
        });
      })
      .catch(e => {
        showToast('获取信息失败');
        set({
          loading: false
        });
        catchErrorLog('userSocialInfo_error', e, { params: { uid } });
      });
  }
}));
