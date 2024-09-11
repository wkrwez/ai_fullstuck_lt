export function replace(arr: unknown[], index: number, value: unknown) {
  if (index < 0 || index >= arr.length) {
    return arr;
  }
  const newArr = [...arr];
  newArr[index] = value;
  return newArr;
}

export function stirngRemoveEnter(s?: string) {
  return s?.replace(/[\r\n\v]/g, '') || '';
}
