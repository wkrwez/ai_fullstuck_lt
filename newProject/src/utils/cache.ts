// 不考虑算法复杂度的最近使用Cache

export interface SimpleCache<T> {
  set: (key: string, value: T) => void;
  get: (key: string) => T | undefined;
  del: (key: string) => void;
}
export const getSimpleCache = <T>(maxCache: number = 1000): SimpleCache<T> => {
  const cacheKeys: string[] = [];
  const cache: Record<string, T> = {};

  function touchKey(key: string) {
    const index = cacheKeys.indexOf(key);
    if (index > 0) {
      cacheKeys.splice(index, 1);
      cacheKeys.unshift(key);
    }
  }
  return {
    set(key, value) {
      if (key in cache) {
        touchKey(key);
        cache[key] = value;
      } else {
        if (cacheKeys.length >= maxCache) {
          const delKey = cacheKeys.pop();
          if (delKey) delete cache[delKey];
        }
        cache[key] = value;
        cacheKeys.unshift(key);
      }
    },
    get(key) {
      if (key in cache) {
        touchKey(key);
      }
      return cache[key];
    },
    del(key) {
      delete cache[key];
      const index = cacheKeys.indexOf(key);
      if (~index) cacheKeys.splice(index, 1);
    }
  };
};
