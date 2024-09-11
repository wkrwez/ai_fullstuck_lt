import { uuid } from '@/src/utils/uuid';
import { createSocketConnect } from '../websocket/connect';
import { stream } from '../websocket/stream';
import { ErrorRes } from '../websocket/stream_connect';
import type { PartialMessage } from '@bufbuild/protobuf';
import { PhotoService } from '@step.ai/proto-gen/raccoon/makephoto/makephoto_connect';
import {
  DeleteMyPhotosRequest,
  GenAllFeaturePromptRequest,
  GenFeaturePromptRequest,
  GenPhotoStoryRequest,
  GenPhotoStoryResponse,
  GenPhotoTitleRequest,
  GetImagegenProtoRequest,
  GetMyPhotosRequest,
  PublishPhotoRequest,
  TakePhotoRequest,
  TakePhotoResponse
} from '@step.ai/proto-gen/raccoon/makephoto/makephoto_pb';

const makePhotoClient = createSocketConnect('Makephoto', PhotoService);

export interface TraceGenPhotoTitleResponse
  extends PartialMessage<GetImagegenProtoRequest> {
  traceid: string;
}
export const GetClientConfig = () => {
  return makePhotoClient
    .getClientConfig({ version: 'v1' })
    .then(res => {
      console.log('GetClientConfig-------', res);
      if (res.config) {
        let config = null;
        try {
          config = JSON.parse(res.config);
        } catch (e) {
          console.log('config json err', res);
        }
        return config;
      }
      console.log('config json err', res);
      console.log('config json err end');
      return null;
    })
    .catch(e => {
      console.log('get config err', e);
      return null;
      //   console.log('get config err', e);
      //   return preset;
    });
};

export const GenFeaturePrompt = (
  payload: PartialMessage<GenFeaturePromptRequest>
) => {
  return makePhotoClient.genFeaturePrompt(payload);
};

export const GenFeaturePrompts = (
  payload: PartialMessage<GenAllFeaturePromptRequest>
) => {
  return makePhotoClient.genAllFeaturePrompt(payload);
};

export const TakePhoto = (
  payload: PartialMessage<TakePhotoRequest>,
  cb: (payload: PartialMessage<TakePhotoResponse>) => void,
  onError: (payload: Uint8Array | PartialMessage<ErrorRes>) => void
) => {
  // return makePhotoClient.takePhoto(payload);
  console.log(['TakePhoto------', payload]);
  return stream(makePhotoClient.takePhoto, payload)
    .on(({ data }) => {
      cb(data);
    })
    .error(({ error }) => {
      onError(error);
    })
    .do();
};

// cursor: string;

// /**
//  * 数据条数，最多限制32条
//  *
//  * @generated from field: uint32 size = 2;
//  */
// size: number;
export const GetMyPhotos = (payload: PartialMessage<GetMyPhotosRequest>) => {
  // pagination
  return makePhotoClient.getMyPhotos(payload);
};

export const GenPhotoTitle = (
  payload: PartialMessage<GenPhotoTitleRequest>
) => {
  return makePhotoClient.genPhotoTitle(payload);
};

export const PublishPhoto = (payload: PartialMessage<PublishPhotoRequest>) => {
  return makePhotoClient.publishPhoto(payload);
};

export const DeleteMyPhotos = (
  payload: PartialMessage<DeleteMyPhotosRequest>
) => {
  return makePhotoClient.deleteMyPhotos(payload);
};

export const GenPhotoStory = (
  payload: PartialMessage<GenPhotoStoryRequest>,
  cb: (
    payload: PartialMessage<GenPhotoStoryResponse>,
    msgId: string,
    traceid: string
  ) => void,
  onError: (payload: Uint8Array | PartialMessage<ErrorRes>) => void,
  msgId: string
) => {
  return stream(makePhotoClient.genPhotoStory, payload)
    .on(({ data, msgId: traceid }) => {
      console.log('GenPhotoStory--------', msgId);
      cb(data, msgId, traceid);
    })
    .error(({ error }) => {
      onError(error);
    })
    .do();
};

export const GetImagegenProto = (
  payload: PartialMessage<GetImagegenProtoRequest>
) => {
  return makePhotoClient.getImagegenProto(payload);
};
