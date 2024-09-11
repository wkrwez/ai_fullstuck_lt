import { create } from 'zustand';
import {
  EmojiDetail,
  EmojiDetailRequest,
  MakeDefaultEmojiRequest,
  RecreateEmojiRequest,
  makeDefaultEmoji,
  makeDefaultEmojiStream,
  queryEmojiDetail,
  recreateEmoji as recreateEmojiClient,
  recreateEmojiStream
} from '@/src/api/emoji';
import { GameType } from '@/src/types';
import { showToast } from '@Components/toast';
import { QueryWorldRes } from '../api/parallel-world';
import { PickPbQueryParams } from '../api/utils';
import { Socket } from '../api/websocket';
import { ErrorRes } from '../api/websocket/stream_connect';
import { logWarn } from '../utils/error-log';
import { StreamMsgType } from '@/proto-registry/src/web/raccoon/emoji/emoji_pb';
import { ActDialog } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { PartialMessage } from '@bufbuild/protobuf';
import {
  EmojiInfo,
  ReCreateEmojiStreamResponse,
  ReCreateResponse
} from '@step.ai/proto-gen/raccoon/emoji/emoji_pb';
import { Role } from '@step.ai/proto-gen/raccoon/makephoto/makephoto_pb';
import { useConfigStore } from './config';

export const ABORT_STRING = 'abort';

export enum CREATE_STATUS {
  CREATING = 'creating',
  FAILED = 'failed'
}

interface EmojiCardInfo {
  cardId: string;
  gameType?: GameType;
}

export type EmojiRoleInfo = PickPbQueryParams<Role>;

type States = {
  cardInfo: EmojiCardInfo | null;
  // 当前卡片的角色信息
  roleInfo: EmojiRoleInfo | null;
  isCreating: boolean;
  createStatus: CREATE_STATUS | null;
  emojiInfo: EmojiInfo | null;
  emojiDetail: EmojiDetail | null;
};
const getDefaultStates = (): States => ({
  cardInfo: null,
  roleInfo: null,
  emojiDetail: null,
  // 用于展示loading状态
  isCreating: false,
  // 用于判断流式执行状态
  createStatus: null,
  emojiInfo: null
});

type Actions = {
  reset: () => void;
  resetCreate: () => void;
  changeCardInfo: (info: EmojiCardInfo) => void;
  changeRoleInfo: (roleInfo: EmojiRoleInfo) => void;
  toggleIsCreating: (isCreating: boolean) => void;
  switchCreateStatus: (status: CREATE_STATUS | null) => void;
  // 获取表情包详情
  getEmojiDetail: (payload: EmojiDetailRequest) => Promise<void>;
  // 初始化表情包
  createDefaultEmoji: (payload: MakeDefaultEmojiRequest) => void;
  createDefaultEmojiByStream: (
    payload: MakeDefaultEmojiRequest,
    signal?: AbortSignal
  ) => void;
  changeEmoji: (emoji: EmojiInfo | null) => void;
  // 二创表情包
  recreateEmoji: (
    payload: RecreateEmojiRequest,
    signal?: AbortSignal
  ) => Promise<ReCreateResponse | undefined>;
  recreateEmojiByStream: (
    payload: RecreateEmojiRequest,
    signal: AbortSignal,
    onMessage: (msg: PartialMessage<ReCreateEmojiStreamResponse>) => void,
    onError: (e: Uint8Array | PartialMessage<ErrorRes> | string) => void
  ) => Promise<void>;
  // 依据 brandType 随机初始化默认角色
  randomDefaultEmojiInfo: (brandtype?: number) => void;
};

export const useEmojiCreatorStore = create<States & Actions>((set, get) => ({
  ...getDefaultStates(),
  reset: () => {
    // cardInfo、roleInfo不要卸载
    const { cardInfo, roleInfo, ...resetInfo } = getDefaultStates();
    set(resetInfo);
  },
  resetCreate: () => {
    // cardInfo、roleInfo不要卸载
    const { cardInfo, roleInfo, emojiDetail, ...resetInfo } =
      getDefaultStates();
    set(resetInfo);
  },
  changeCardInfo(info) {
    set({ cardInfo: info });
  },
  changeRoleInfo(info) {
    set({ roleInfo: info });
  },
  changeEmoji(emoji) {
    set({ emojiInfo: emoji });
  },
  toggleIsCreating(isCreating) {
    set({ isCreating: isCreating });
  },
  switchCreateStatus(status) {
    set({ createStatus: status });
  },
  async getEmojiDetail(payload) {
    try {
      const { roleInfo } = get();
      const res = await queryEmojiDetail(payload);
      // TODO初始化角色信息待优化
      set({
        emojiDetail: res
        // roleInfo: {
        //   ...roleInfo,
        //   role: res.role[0]?.roleId ?? '',
        //   brandType: res?.brand?.brandId ?? -1
        // }
      });
      console.log('getEmojiDetail res------>', JSON.stringify(res));
    } catch (e) {
      logWarn('getEmojiDetail', e);
    }
  },
  async createDefaultEmoji(payload) {
    const { toggleIsCreating } = get();
    try {
      toggleIsCreating(true);
      const res = await makeDefaultEmoji(payload);
      console.log('---------->createDefaultEmoji');

      set({ emojiInfo: res?.emoji ?? null });
    } catch (e) {
      console.log('createDefaultEmoji err----->', e);
      console.log('createDefaultEmoji err payload----->', payload);
    } finally {
      toggleIsCreating(false);
    }
  },
  async createDefaultEmojiByStream(payload, signal) {
    const { toggleIsCreating, switchCreateStatus } = get();
    toggleIsCreating(true);
    switchCreateStatus(CREATE_STATUS.CREATING);
    const errorEvent = () => {
      console.log('disconnect!!!!!!!!!!!!!');
      toggleIsCreating(false);
      switchCreateStatus(CREATE_STATUS.FAILED);
      showToast('当前网络信号差，请重试~');
    };

    makeDefaultEmojiStream(
      payload,
      msg => {
        if (signal?.aborted) {
          return;
        }
        if (msg.msgType === StreamMsgType.STREAM_MSG_IMAGE) {
          set({ emojiInfo: (msg?.emoji as EmojiInfo) ?? null });
          toggleIsCreating(false);
        }
        if (msg.isFinish) {
          console.log('finish!!!!!!!!!!!!', msg);
          switchCreateStatus(null);
          Socket.events.off('disconnect', errorEvent);
        }
      },
      e => {
        toggleIsCreating(false);
        switchCreateStatus(CREATE_STATUS.FAILED);
        Socket.events.off('disconnect', errorEvent);
      }
    );

    Socket.events.on('disconnect', errorEvent, true);
  },
  async recreateEmoji(payload, signal) {
    const { toggleIsCreating } = get();
    try {
      toggleIsCreating(true);
      let cur = Date.now();
      console.log();
      const res = await recreateEmojiClient(payload);

      console.log('recreate spend--------->', Date.now() - cur);

      if (signal && signal.aborted) {
        throw ABORT_STRING;
      }
      console.log('recreateEmoji------->', JSON.stringify(res));
      set({ emojiInfo: res?.emoji ?? null });
      return res;
    } catch (e) {
      console.log('recreateEmoji err-----> payload', payload);
      logWarn('recreateEmoji', e);
      throw e;
    } finally {
      toggleIsCreating(false);
    }
  },
  async recreateEmojiByStream(payload, signal, onMessage, onError) {
    const { toggleIsCreating, switchCreateStatus } = get();
    toggleIsCreating(true);
    switchCreateStatus(CREATE_STATUS.CREATING);

    const errorEvent = (e: any) => {
      // console.log('disconnect!!!!!!!!!!!!!');
      // toggleIsCreating(false);
      // switchCreateStatus(CREATE_STATUS.FAILED);
      // showToast('当前网络信号差，请重试~');

      switchCreateStatus(CREATE_STATUS.FAILED);
      toggleIsCreating(false);
      onError(e);
    };

    recreateEmojiStream(
      payload,
      msg => {
        if (signal?.aborted) {
          return;
        }
        if (msg.msgType === StreamMsgType.STREAM_MSG_IMAGE) {
          set({ emojiInfo: (msg?.emoji as EmojiInfo) ?? null });
          toggleIsCreating(false);
        }
        if (msg.isFinish) {
          console.log('finish!!!!!!!!!!!!', msg);
          switchCreateStatus(null);
          Socket.events.off('disconnect', errorEvent);
        }
        onMessage(msg);
      },
      e => {
        logWarn('recreateEmojiStream', e);
        errorEvent(e);
        Socket.events.off('disconnect', errorEvent);
      }
    );
    Socket.events.on('disconnect', errorEvent, true);
  },
  randomDefaultEmojiInfo(brandType?: number) {
    const { changeRoleInfo, changeCardInfo } = get();
    const roles = useConfigStore.getState().roles;
    const brandRoles = roles?.filter(r => r.ip === brandType) || [];
    const randomIndex = Math.floor(brandRoles.length * Math.random());

    changeCardInfo({
      cardId: ''
    });
    changeRoleInfo({
      brandType: brandType ?? -1,
      role: brandRoles[randomIndex].id || ''
    });
  }
}));

// 初始化平行世界emoji相关数据
export const initParallelWorldEmojiInfo = (res: QueryWorldRes) => {
  /* 初始化卡片信息 */
  useEmojiCreatorStore.getState().changeCardInfo({
    cardId: res?.world?.cardId ?? ''
  });

  /* 初始化角色信息 */
  // 拍平actItems
  const flattenActItems = res?.plot?.acts?.map(a => a.actItems).flat();

  // 找第一个对话里出现的人
  const defaultDialog = flattenActItems?.find(
    item => item.item.case === 'dialog'
  )?.item?.value as ActDialog;

  // 过滤ip对应角色
  const roles = useConfigStore.getState().roles;
  const brandId = res?.world?.brands[0] ?? -1;
  const brandRoles = roles?.filter(r => r.ip === brandId) || [];

  // 默认角色(大概找一下)
  const defaultRole =
    brandRoles?.find(r => r.name[0] === defaultDialog?.role[0]) ||
    brandRoles[0];

  useEmojiCreatorStore.getState().changeRoleInfo({
    brandType: brandId,
    role: defaultRole?.id ?? ''
  });
};
