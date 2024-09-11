import { MMKV } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';

export const storage = new MMKV();

export enum StoreStorageKey {
  BrandStore = 'BrandStore',
  ControlStore = 'ControlStore'
}

export const mkvStorage = createJSONStorage(() => ({
  getItem: key => storage.getString(key) ?? '',
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key)
}));
