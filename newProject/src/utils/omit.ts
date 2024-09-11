// @ts-ignore
export function omit(obj, keys) {
  const result = {};
  Object.keys(obj).forEach(key => {
    if (!keys.includes(key)) {
      // @ts-ignore
      result[key] = obj[key];
    }
  });
  return result;
}
