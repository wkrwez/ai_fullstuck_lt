/** 发布页 */
import { create } from 'zustand';
import {
  DeleteMyPhotos,
  GenPhotoTitle,
  GetMyPhotos,
  type TraceGenPhotoTitleResponse
} from '@/src/api/makephotov2';
import { catchErrorLog, logWarn } from '@Utils/error-log';
import { Pagination } from '../types';
import { omit } from '../utils/omit';
import { getPageID } from '../utils/report';
import type { PartialMessage } from '@bufbuild/protobuf';
import {
  GenPhotoTitleResponse,
  Photo,
  PhotoProgress,
  PhotoTaskState,
  Role
} from '@step.ai/proto-gen/raccoon/makephoto/makephoto_pb';

export interface SelectedItem extends PartialMessage<Photo> {
  num: number;
}

type States = {
  photos: SelectedItem[];
  photosSet: { [key in string]: SelectedItem };
  deletedPhotoSet: { [key in string]: number };
  albumPhotos: PartialMessage<PhotoProgress>[];
  pagination: PartialMessage<Pagination>;
  story: string;
  listEnd: boolean;
};

type SelectedItems = {
  [key in string]: SelectedItem;
};

export type AdviceTitle = {
  text: string;
  traceid: string;
  index: number;
};

type Actions = {
  getAlbumPhotos: (refresh?: boolean, refreshSilent?: boolean) => Promise<void>;
  getAdvicePrompts: (story: string) => Promise<AdviceTitle[]>;
  changePhotos: (payload: States['photosSet']) => void;
  removePhotos: (seleted: SelectedItems) => Promise<unknown>;
  //   request: (uid: bigint) => void;
  //   placeholder: (payload: PartialMessage<UserProfile>) => void;
  reset: () => void;
};

const resetState = () => {
  return {
    photos: [],
    story: '',
    photosSet: {},
    albumPhotos: [],
    listEnd: false,
    deletedPhotoSet: {},
    pagination: {
      cursor: '',
      size: 12,
      nextCursor: ''
    }
  };
};

export const usePublishStore = create<States & Actions>()((set, get) => ({
  ...resetState(),
  reset() {
    set({ ...resetState() });
  },
  removePhotos(selected) {
    const photoIds = Object.keys(selected);
    return DeleteMyPhotos({ photoIds })
      .then(res => {
        set({
          albumPhotos: get().albumPhotos.filter(item => {
            return !item.photoId || !photoIds.includes(item.photoId);
          }),
          deletedPhotoSet: {
            ...get().deletedPhotoSet,
            ...photoIds.reduce(
              (res, key) => {
                res[key] = 1;
                return res;
              },
              {} as States['deletedPhotoSet']
            )
          }
        });

        const { photosSet } = get();
        const removedPhotosSet: States['photosSet'] = omit(
          get().photosSet,
          photoIds
        );
        const newPhotosSet = Object.values(removedPhotosSet)
          .sort((a, b) => {
            return a.num - b.num;
          })
          .reduce(
            (result, val, index) => {
              if (val.photoId) {
                result[val.photoId] = {
                  ...val,
                  num: index + 1
                };
              }
              return result;
            },
            {} as States['photosSet']
          );

        console.log('remove_photos-----', removedPhotosSet, newPhotosSet);

        get().changePhotos(newPhotosSet);
        const { albumPhotos } = usePublishStore.getState();
        if (!albumPhotos.length) {
          get().getAlbumPhotos(true);
        }
      })
      .catch(e => {
        console.log(e);
        catchErrorLog('remove_photos_error', e);
      });
  },
  changePhotos(photosSet: States['photosSet']) {
    console.log('changePhotos------', photosSet);
    set({
      photosSet,
      photos: Object.values(photosSet).sort((a, b) => a.num - b.num)
    });
  },
  getAlbumPhotos(refresh, refreshSilent) {
    const { albumPhotos } = get();
    const newAlbumPhotos = refresh ? [] : albumPhotos;
    if (refresh) {
      set({
        pagination: {
          cursor: '',
          size: 12,
          nextCursor: ''
        },
        listEnd: false,
        albumPhotos: refreshSilent ? albumPhotos : []
      });
    }
    const { pagination, listEnd } = get();
    console.log('pagination--------', pagination, refresh);
    if (listEnd) {
      return Promise.resolve();
    }
    return GetMyPhotos({
      pagination: refresh
        ? {
            cursor: '',
            size: 12,
            nextCursor: ''
          }
        : pagination
    }).then(({ photos, pagination }) => {
      console.log(
        'GetMyPhotos-----',
        pagination?.nextCursor,
        listEnd,
        photos.length,
        JSON.stringify(photos[0])
      );
      if (!pagination?.nextCursor) {
        set({
          listEnd: true
        });
      }
      set({
        albumPhotos: newAlbumPhotos.concat(photos),
        pagination: {
          ...pagination,
          cursor: pagination?.nextCursor,
          nextCursor: ''
        }
      });
    });
  },
  getAdvicePrompts(story) {
    const { photos } = get();
    if (!photos[0]) return Promise.resolve([]);
    return GenPhotoTitle({
      photoId: photos[0]?.photoId,
      content: story || '',
      pt: {
        page: getPageID()
      }
    }).then(res => {
      console.log('getAdvicePrompts', res);
      return res.titles
        .filter(title => title.trim().length > 0)
        .map((title, index) => ({
          text: title,
          // @ts-ignore to fix it
          traceid: res.traceid,
          index
        }));
    });
  }
}));
