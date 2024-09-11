import { create } from 'zustand';
import { queryEmojiList } from '@/src/api/emoji';
import { Pagination } from '@/src/types';
import type { PartialMessage } from '@bufbuild/protobuf';
import {
  EmojiInfo,
  EmojiModule
} from '@step.ai/proto-gen/raccoon/emoji/emoji_pb';

type States = {
  mineEmoji: EmojiInfo[];
  minePagin: PartialMessage<Pagination>;
  recommendEmoji: EmojiInfo[];
  selectedEmojis: EmojiInfo[];
};

type Actions = {
  reset: () => void;
  init: () => Promise<unknown> | undefined;
  getMyEmojiList: (params: {
    pagination?: PartialMessage<Pagination>;
  }) => Promise<unknown> | undefined;

  changeSelectedEmojis: (emojis: EmojiInfo[]) => void;
};

const defaultPagin = { cursor: '', size: 10, nextCursor: '' };

const getDefaultStates = (): States => ({
  // 我的表情列表
  mineEmoji: [],
  // 我的表情分页
  minePagin: defaultPagin,
  // 推荐表情列表
  recommendEmoji: [],
  // 选择的表情包
  selectedEmojis: []
});

export const useEmojiStore = create<States & Actions>((set, get) => ({
  ...getDefaultStates(),
  reset: () => {
    set(getDefaultStates());
  },
  async init() {
    try {
      const res = await queryEmojiList({ emojiModule: EmojiModule.ALL });
      const { mineEmoji, recommendEmoji } = res;
      console.log('res---------->', JSON.stringify(res));
      set({
        mineEmoji: mineEmoji?.emojis ?? [],
        recommendEmoji: recommendEmoji?.emojis ?? [],
        minePagin: mineEmoji?.pagination
      });
    } catch (e) {
      console.log('emoji init err------->', e);
    }
  },
  async getMyEmojiList({ pagination }) {
    try {
      const { mineEmoji: mineEmojiExist } = get();
      const { mineEmoji } = await queryEmojiList({
        emojiModule: EmojiModule.MINE,
        pagination: pagination as Pagination
      });
      console.log('pagination------->', mineEmoji?.pagination);

      set({
        mineEmoji: [...mineEmojiExist, ...(mineEmoji?.emojis ?? [])],
        minePagin: mineEmoji?.pagination ?? {}
      });
    } catch (e) {
      console.log('emoji init err------->', e);
    }
  },
  changeSelectedEmojis(emojis) {
    set({ selectedEmojis: emojis });
  }
}));
