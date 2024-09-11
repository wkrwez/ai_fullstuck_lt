// 1～4字符时，字号显示58
// 5～6字符是，字号显示52
// 7字符时，字号显示38
// 8字符，折行。
// 8～14字符时，字号显示38
// 15～16字符时，字号显示34
// 17～20字符时，字号显示28
export interface EmojiFontInfo {
  size: number;
  lines: number;
}
export const getEmojiFontInfo = (text: string): EmojiFontInfo => {
  const length = text.length;
  let size = 58;
  let lines = 1;

  if (length >= 1 && length <= 4) {
    size = 58;
  } else if (length === 5) {
    size = 52;
  } else if (length === 6 || length === 7) {
    size = 38;
  } else if (length >= 8 && length <= 14) {
    size = 38;
    lines = 2;
  } else if (length >= 15 && length <= 16) {
    size = 34;
    lines = 2;
  } else if (length >= 17) {
    size = 28;
    lines = 2;
  }

  return { size, lines };
};

export const isEmoji = (text: string) => {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
  return emojiRegex.test(text);
};
