import { create } from 'zustand';
import {
  CreateWorldTitleRequest,
  PublishWorldRequest,
  createParallelWorldTitle,
  publishParallelWorld
} from '../api/parallel-world/publish';
import { logWarn } from '../utils/error-log';
import { ActImage } from '@/proto-registry/src/web/raccoon/world/common_pb';

/** 详情 */
type States = {
  isChangeCoverModalVisible: boolean;
  title: string;
  isCreatingTitle: boolean;
  coverImg: ActImage | null;
};

type Actions = {
  reset: () => void;
  openChangeCoverModal: () => void;
  closeChangeCoverModal: () => void;
  changeTitle: (text: string) => void;
  createTitle: (payload: CreateWorldTitleRequest) => Promise<void>;
  changeCoverImg: (img: ActImage | null) => void;
};

const getDefaultStates = (): States => ({
  isChangeCoverModalVisible: false,
  title: '',
  isCreatingTitle: false,
  coverImg: null
});

export const useParallelWorldPublishStore = create<States & Actions>()(
  (set, get) => ({
    ...getDefaultStates(),
    reset: () => {
      set(getDefaultStates());
    },
    openChangeCoverModal() {
      set({ isChangeCoverModalVisible: true });
    },
    closeChangeCoverModal() {
      set({ isChangeCoverModalVisible: false });
    },
    changeCoverImg(imgUrl) {
      set({ coverImg: imgUrl });
    },
    // 创建新世界的提示词
    changeTitle(text) {
      set({ title: text });
    },
    // 小狸帮想
    async createTitle(payload) {
      set({ isCreatingTitle: true });
      try {
        const res = await createParallelWorldTitle(
          payload,
          d => {
            console.log('createPlotChoice----------->res', d);
            set({
              title: d?.title ?? '',
              isCreatingTitle: false
            });
          },
          e => {
            console.log('createPlotChoice ERROR: ', e);
            set({
              title: '失败了W(ﾟДﾟ)W，请重试',
              isCreatingTitle: false
            });
          }
        );
        console.log('createTitle------------>', res);
      } catch (e) {
        logWarn('createTitle', e);
      }
    }
  })
);
