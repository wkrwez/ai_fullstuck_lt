import { useEffect, useRef, useState } from 'react';
import { feedClient } from '@/src/api';
import { useHistoryStore } from '@/src/store/histroy';
import { Pagination } from '@/src/types';
import { ListResponse } from '@/src/types';
import { logWarn } from '@/src/utils/error-log';
import { reportClick } from '@/src/utils/report';
import { RequestScene } from '../infiniteList/typing';
import { FeedRichCardInfo } from '@/app/feed/type';
import type { PartialMessage } from '@bufbuild/protobuf';
import { SingleCardResponse } from '@step.ai/proto-gen/raccoon/query/query_pb';
import { useShallow } from 'zustand/react/shallow';

const PAGE_SIZE = 10;

let mockCount = 0;

export type FetchMethodPayloadType = {
  scene: RequestScene;
  pagination: PartialMessage<Pagination>;
};
export type FetchMethodType = (
  payload: FetchMethodPayloadType
) => Promise<ListResponse>;

export function useRequestFeed(config: {
  defaultFetch?: boolean;
  requestParams?: object;
  // 自定义 fetch 方法, requestParams 失效
  fetchMethod?: FetchMethodType;
  onFirstDataRendered?: (step: 1 | 2 | 3) => void; // todo @linyueqiang 看看要不要拆出去 1开始请求， 2请求成功 3 请求结束
  onError?: (scene: RequestScene) => void;
}) {
  const [sourceData, setSourceData] = useState<FeedRichCardInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const isFirstFetch = useRef(true);
  const paginationInfo = useRef<Pagination>(
    new Pagination({
      cursor: undefined,
      size: PAGE_SIZE
    })
  );

  // 删除状态
  const { viewHistory, blacklist } = useHistoryStore(
    useShallow(state => ({
      viewHistory: state.viewHistory,
      blacklist: state.blacklist
    }))
  );

  const fetchList = async (scene: RequestScene) => {
    // console.log('======lin fetchList', scene);

    const isInit =
      scene === RequestScene.INIT || scene === RequestScene.REFRESHING;
    if ((!isInit && !hasMore) || loading) {
      return;
    }
    const prevData = isInit ? [] : sourceData.slice();
    const paginationForRequest = isInit
      ? new Pagination({
          cursor: undefined,
          size: PAGE_SIZE
        })
      : paginationInfo.current;

    const needLogFirstData = isFirstFetch.current && config.onFirstDataRendered;
    setLoading(true);
    setError(undefined);

    if (scene === RequestScene.REFRESHING) {
      reportClick('refresh_button', {});
    }

    try {
      if (needLogFirstData) {
        config.onFirstDataRendered?.(1);
      }

      //   await new Promise((r, reject) => {
      //     setTimeout(() => {
      //       if (mockCount % 3 === 0) {
      //         reject(new Error());
      //       } else {
      //         r(1);
      //       }
      //       mockCount++;
      //     }, 1000);
      //   });

      const res: ListResponse = await (config.fetchMethod
        ? config.fetchMethod({
            pagination: paginationForRequest,
            scene
          })
        : feedClient.allCards({
            ...config.requestParams,
            pagination: paginationForRequest
          }));

      if (needLogFirstData) {
        config.onFirstDataRendered?.(2);
      }

      const { pagination } = res;
      const cards = res.cards as FeedRichCardInfo[];
      const packData = prevData.concat(cards);
      setSourceData(packData);

      const hasMore = Boolean(pagination?.nextCursor);
      setHasMore(hasMore);

      paginationInfo.current = new Pagination({
        cursor: pagination?.nextCursor,
        size: PAGE_SIZE
      });
    } catch (e) {
      logWarn('fetch waterfall error [fetchType]:' + scene, e);
      setError(e as Error);
      config.onError?.(scene);
    } finally {
      setLoading(false);
      isFirstFetch.current = false;
      config.onFirstDataRendered?.(3);
    }
  };

  const unshiftData = (
    appendId: string,
    handlers?: {
      onError?: () => void;
      onSuccess?: () => void;
    }
  ) => {
    feedClient
      .singleCard({
        cardId: appendId
      })
      .then((res: SingleCardResponse) => {
        const card = res.cards; // || res.card;
        if (!card) return;
        const newData = [
          new FeedRichCardInfo({
            ...card,
            isAppend: true
          }),
          ...sourceData
        ];
        setSourceData(newData);
        handlers?.onSuccess?.();
      })
      .catch(e => {
        logWarn('singleCardError', e);
        handlers?.onError?.();
      });
  };

  useEffect(() => {
    const data = sourceData.filter(item => {
      const cardId = item.card?.id;
      if (cardId && viewHistory[cardId]?.deleted) {
        return false;
      }
      if (item.user?.uid && blacklist.includes(item.user?.uid)) {
        return false;
      }
      return true;
    });
    if (data.length !== sourceData.length) {
      setSourceData(data);
    }
  }, [viewHistory, blacklist]);

  useEffect(() => {
    if (config.defaultFetch !== false) {
      fetchList(RequestScene.INIT);
    }
  }, []);

  return {
    loading,
    sourceData,
    error,
    hasMore,
    fetchList,
    unshiftData
  };
}
