export function checkNullObj(obj: object) {
  if (!obj) return true;
  return !Object.keys(obj).length;
}
