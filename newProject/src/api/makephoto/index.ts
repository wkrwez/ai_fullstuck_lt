import preset from '@/src/config/preset';
import { TaskItem, TaskState } from '@/src/types';
import { Socket } from '../websocket';
import { createSocketConnect } from '../websocket/connect';
import { stream } from '../websocket/stream';
import { ErrorRes } from '../websocket/stream_connect';
import { PhotoService } from '@/proto-registry/src/web/raccoon/makephoto/makephoto_connect';
import {
  CleanPhotoTaskRequest,
  GetClientConfigRequest,
  GetPhotoTaskRequest,
  GetPhotoTaskResponse,
  GetPublishRequest,
  MakePhotoStoryRequest,
  MakePhotoTakingAdviceRequest,
  PhotoProgress,
  PhotoTask,
  PhotoTaskState,
  PublishPhotoRequest,
  TakePhotoRequest,
  TakePhotoResponse
} from '@/proto-registry/src/web/raccoon/makephoto/makephoto_pb';
import { Payload } from '@/proto-registry/src/web/step/push/v1/push_pb';

export const makePhotoClient = createSocketConnect('Makephoto', PhotoService);

export const TakePhoto = (
  payload: TakePhotoRequest,
  cb?: (data: PhotoProgress[]) => void
) => {
  const generated: { [key in string]: { data: PhotoProgress; index: number } } =
    {};
  let index = 0;
  return stream(makePhotoClient.takePhoto, payload)
    .on(({ data }) => {
      console.log('[res TakePhoto]', JSON.stringify(data));
      if (!data.task) {
        console.log('收到空包----'); // todo 上报
        return;
      }
      const { progess } = data.task;

      progess.forEach(item => {
        const { photoId } = item;
        if (!photoId) {
          console.log('photoId为空-------', item); // todo 上报
          return;
        }
        if (generated[photoId]) {
          generated[photoId].data.cencorState = item.cencorState;
        } else {
          generated[photoId] = { index, data: item };
          index += 1;
        }
      });

      const photoData = Object.values(generated)
        .sort((a, b) => a.index - b.index)
        .map(i => i.data);
      if (photoData && cb) {
        cb(photoData);
      }
    })
    .do();
};

export const GetPhotoTask = (
  payload: GetPhotoTaskRequest,
  onData: (data: TaskItem<PhotoTask>) => void
) => {
  return stream(makePhotoClient.getPhotoTask, payload)
    .on(({ data, throwError }) => {
      const { tasks } = data;
      if (!tasks || !tasks[0]) {
        onData({ state: TaskState.initial });
        return;
      }
      const { state, progess, params } = tasks[0]; // todo 待确认任务顺序
      // console.log(9999, tasks[0].progess)
      // if (state === PhotoTaskState.ABORTED) {
      //     onData({
      //         state: TaskState.initial,
      //         error: new ErrorRes({
      //             code: 1,
      //             reason: '生成中断'
      //         })
      //     })
      //     return
      // }

      if (state) {
        const mapState = {
          [PhotoTaskState.PENDING]: TaskState.initial,
          [PhotoTaskState.PROCESSING]: TaskState.pending,
          [PhotoTaskState.FINISHED]: TaskState.completed,
          [PhotoTaskState.ABORTED]: TaskState.completed // 生成中断暂时也不处理，当成完成
        };
        const progess: PhotoProgress[] = tasks.reduce(
          (result: PhotoProgress[], item: PhotoTask) => {
            return result.concat(item.progess || []);
          },
          []
        );
        // const progess = tasks[0].progess
        if (!progess.length) {
          onData({
            state: TaskState.initial
          });
          return;
        }

        onData({
          state: mapState[state],
          data: new PhotoTask({
            progess,
            params
          })
        });
      } else {
        console.log('[error]getPhotoTask tasks', tasks);
        // 主动抛错
        throwError(
          new ErrorRes({ code: 1, reason: '[error]getPhotoTask tasks' })
        );
        // reject({ code: 1, reason: '[error]getPhotoTask tasks' })
      }
    })
    .do();
};

export const MakePhotoTakingAdvice = (
  payload: MakePhotoTakingAdviceRequest
) => {
  console.log('[MakePhotoTakingAdvice]--request', payload);
  const startTime = Date.now();
  let string = '';
  return stream(makePhotoClient.makePhotoTakingAdvice, payload)
    .on(({ data, resolve }) => {
      console.log('[MakePhotoTakingAdvice time]', Date.now() - startTime);
      const { adviceDelta, finished } = data;
      if (!finished) {
        // string += advice_delta
        if (adviceDelta) {
          string = adviceDelta;
        }
      } else {
        resolve({ adviceDelta: string });
      }
    })
    .do();
};

export const MakePhotoStory = (payload: MakePhotoStoryRequest) => {
  console.log('[MakePhotoStory]--request', payload);
  const startTime = Date.now();
  let string = '';

  return stream(makePhotoClient.makePhotoStory, payload)
    .on(({ data, resolve }) => {
      // console.log('[MakePhotoStory time]', Date.now() - startTime)
      const { storyDelta, finished } = data;
      if (!finished) {
        string += storyDelta;
      } else {
        resolve({ storyDelta: string });
      }
    })
    .do();
};
export const PublishPhoto = (payload: PublishPhotoRequest) => {
  console.log('[PublishPhoto]--request', payload);
  return makePhotoClient.publishPhoto(payload).then(res => {
    CleanPhotoTask();
    return res;
  });
};

export const CleanPhotoTask = () => {
  console.log('[CleanPhotoTask]--request');
  return makePhotoClient.cleanPhotoTask(new CleanPhotoTaskRequest({}));
};

export const GetClientConfigService = () => {
  console.log('[GetClientConfigService]--request');
  return makePhotoClient.getClientConfig(
    new GetClientConfigRequest({ version: 'v1' })
  );
};

export const GetClientConfig = () => {
  return GetClientConfigService()
    .then(res => {
      console.log('[GetClientConfig res]', Socket._connid);
      if (res.config) {
        let config = null;
        try {
          config = JSON.parse(res.config);
        } catch (e) {
          console.log('config json err', res);
        }
        return config || preset;
      }
      console.log('config json err', res);
      console.log('config json err end');
      return null;
    })
    .catch(e => {
      console.log('get config err', e);
      return preset;
    });
};

export const GetPublish = (payload: GetPublishRequest) => {
  return makePhotoClient.getPublish(payload);
};
