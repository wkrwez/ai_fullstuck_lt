export type PromptsArrType<T extends string> = {
  [key in T]?: string[];
};

export function parsePrompts<T extends string>(
  string: string
): PromptsArrType<T> {
  // 使用正则表达式匹配字符串中的标签和值
  const matches = string.matchAll(/<(\w+):([^>]+)>/g);
  // 将匹配结果转换为指定格式的对象
  const result: PromptsArrType<T> = {};
  for (const match of matches) {
    const [_, key, value] = match;
    // @ts-ignore
    if (!result[key]) {
      // @ts-ignore
      result[key] = [];
    }
    // @ts-ignore
    result[key].push(value);
  }

  return result;
}
