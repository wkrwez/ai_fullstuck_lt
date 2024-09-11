// 从state里面取对象(简化写法)
export function selectState<T, K extends keyof T>(
  state: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (selectedState, key) => {
      selectedState[key] = state[key];
      return selectedState;
    },
    {} as Pick<T, K>
  );
}
