import { create } from 'zustand';

// import { chatExampleClient } from '../api/services';
// import { ChatExample } from '@step.ai/proto-gen/proto/chat/v1/chat_example_pb';

// 用户

type States = {
  // examples: ChatExample[];
};

type Actions = {
  syncExamples: () => void;
};

export const useExampleStore = create<States & Actions>(() => ({
  examples: [],
  async syncExamples() {
    // const { results } = await chatExampleClient.listExample({
    //   filterStatus: 1,
    //   limit: 10
    // });

    // if (results) set({ examples: results });
  },
}));
