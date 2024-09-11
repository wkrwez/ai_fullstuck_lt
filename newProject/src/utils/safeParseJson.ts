export function safeParseJson<T>(str?: string) {
  try {
    return str ? (JSON.parse(str) as T) : undefined;
  } catch (error) {
    return undefined;
  }
}
