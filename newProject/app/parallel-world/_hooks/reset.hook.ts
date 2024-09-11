import { useParallelWorldStore } from '@/src/store/parallel-world';
import { useParallelWorldConsumerStore } from '@/src/store/parallel-world-consumer';
import { useParallelWorldFeedStore } from '@/src/store/parallel-world-feed';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { useParallelWorldPublishStore } from '@/src/store/parallel-world-publish';
import { useShallow } from 'zustand/react/shallow';

export const useReset = () => {
  const { reset: resetPublic } = useParallelWorldStore(
    useShallow(state => ({
      reset: state.reset
    }))
  );
  const { reset: resetMain } = useParallelWorldMainStore(
    useShallow(state => ({
      reset: state.reset
    }))
  );
  const { reset: resetFeed } = useParallelWorldFeedStore(
    useShallow(state => ({
      reset: state.reset
    }))
  );
  const { reset: resetConsumer } = useParallelWorldConsumerStore(
    useShallow(state => ({
      reset: state.reset
    }))
  );
  const { reset: resetPublish } = useParallelWorldPublishStore(
    useShallow(state => ({
      reset: state.reset
    }))
  );

  const resetWorld = () => {
    resetPublic();
    resetMain();
    resetFeed();
    resetConsumer();
    resetPublish();
  };

  return {
    resetWorld,
    resetPublic,
    resetMain,
    resetFeed,
    resetConsumer,
    resetPublish
  };
};
