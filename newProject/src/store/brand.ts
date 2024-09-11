import { create } from 'zustand';
import { feedClient } from '../api';
import { BrandInfo } from '../types';
import { FakeIps } from '@/app/feed/operate';
import { persist } from 'zustand/middleware';
import { StoreStorageKey, mkvStorage } from './persistent';

// type IPDetail = Pick<
//   BrandInfo,
//   | 'bgColor'
//   | 'brand'
//   | 'description'
//   | 'detailBgImgUrl'
//   | 'displayName'
//   | 'hot'
//   | 'iconUrl'
//   | 'state'
// >;

type States = {
  brandInfos: BrandInfo[];
  // @deprecated 建议使用 useControlStore 中的开关
  brandShow: boolean;
};

type Actions = {
  syncBrandInfos: (brands?: number[]) => Promise<BrandInfo[]>;
  getBrandInfo: (brandId: number) => Promise<BrandInfo | undefined>;
  setBrandInfos: (brandInfos: BrandInfo[]) => void;
  setBrandShow: (brandShow: boolean) => void;
};

export const useBrandStore = create<States & Actions>()(
  persist(
    (set, get) => ({
      brandInfos: [],
      brandShow: false,
      setBrandInfos: brandInfos => {
        set({
          brandInfos
        });
      },
      setBrandShow: brandShow => {
        set({
          brandShow
        });
      },
      async syncBrandInfos() {
        const res = await feedClient.getBrandInfos({});
        if (res.brandInfos) {
          get().setBrandInfos(res.brandInfos);
        }
        if (res.show) {
          get().setBrandShow(res.show);
        }
        return res.brandInfos;
      },
      async getBrandInfo(brandId: number) {
        const brandInfos = get().brandInfos;
        if (brandInfos.length) {
          return brandInfos.find(brand => brand.brand === brandId);
        } else {
          const res = await feedClient.getBrandInfos({
            brandIdList: [brandId]
          });
          return res.brandInfos[0];
        }
      }
    }),
    {
      name: StoreStorageKey.BrandStore,
      storage: mkvStorage,
      partialize: state => ({
        brandInfos: state.brandInfos
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to rehydrate:', error);
        } else if (state?.brandInfos) {
          console.log(state?.brandInfos, 'rehydrate');
          /**
           * persist 中会调用 JSON.stringfy 进行序列此时会调用 toJson 方法，
           * 所以需要调用 fromJsonString 重新反序列化一次，而不能直接使用 Json.parse 的值
           */
          try {
            if (state.brandInfos) {
              let brandInfos = state.brandInfos.map(brandInfo => {
                return BrandInfo.fromJsonString(JSON.stringify(brandInfo));
              });
              state.setBrandInfos(brandInfos);
            }
          } catch (err) {
            console.log(err, 'Rehydrate 失败');
          }
        }
      }
    }
  )
);
