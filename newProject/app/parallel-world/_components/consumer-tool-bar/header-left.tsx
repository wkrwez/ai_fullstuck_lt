import React from 'react';
import { Pressable } from 'react-native';
import { Icon, hideToast, showToast } from '@/src/components';
import { selectState } from '@/src/store/_utils';
import { useParallelWorldStore } from '@/src/store/parallel-world';
import {
  PLOT_CREATE_STATUS_ENUM,
  useParallelWorldConsumerStore
} from '@/src/store/parallel-world-consumer';
import { useShallow } from 'zustand/react/shallow';

export default function ConsumerHeaderLeft() {
  const { popWorldRouteStack } = useParallelWorldStore(
    useShallow(state => selectState(state, ['popWorldRouteStack']))
  );

  const {
    plotCreateStatus,
    abortController,
    isNextChapterModalVisible,
    changePlotCreateStatus,
    resetVirtualTimeline,
    restoreActsBackup,
    openNextChapterModal,
    isNewWorldMounted
  } = useParallelWorldConsumerStore(
    useShallow(state =>
      selectState(state, [
        'plotCreateStatus',
        'abortController',
        'isNextChapterModalVisible',
        'resetVirtualTimeline',
        'restoreActsBackup',
        'changePlotCreateStatus',
        'openNextChapterModal',
        'isNewWorldMounted'
      ])
    )
  );

  const handleBack = () => {
    // 参考createError的处理逻辑
    abortController?.abort();
    if (
      isNewWorldMounted &&
      plotCreateStatus < PLOT_CREATE_STATUS_ENUM.CREATED
    ) {
      showToast('正在取消...');

      // clearPlotContent();
      // setTimeout(() => {
      changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.CREATED);
      hideToast();
      openNextChapterModal();
      resetVirtualTimeline();
      restoreActsBackup();
      // }, ERR_DISPLAY_DUR);
    } else {
      // switchParallelWorldPage(PARALLEL_WORLD_PAGES_ENUM.FEED);
      popWorldRouteStack();
    }
  };

  return (
    <Pressable onPress={handleBack}>
      <Icon icon={isNextChapterModalVisible ? 'close2' : 'back_pw'} size={24} />
    </Pressable>
  );
}
