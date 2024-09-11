import dayjs from 'dayjs';

const TIME_FORMAT = 'YYYY-MM-DD';
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const THREE_DAY = 3 * DAY;

export function formatDate(targetTime: number | bigint | null | undefined) {
  if (!targetTime) {
    return '';
  }
  const currentTime = new Date().getTime();

  targetTime = Number(targetTime);
  const gap = currentTime - targetTime;
  if (gap < 0) {
    return '';
  }

  if (gap < HOUR) {
    return Math.max(Math.ceil(gap / MINUTE), 1) + '分钟前';
  } else if (gap < DAY) {
    return Math.ceil(gap / HOUR) + '小时前';
  } else if (gap < THREE_DAY) {
    return Math.ceil(gap / DAY) + '天前';
  } else {
    return dayjs(targetTime).format(TIME_FORMAT);
  }
}

export const isCrossDay = (d1: number, d2: number, unit = 's') => {
  const poke = unit === 'ms' ? 1 : 1000;
  const date1 = new Date(d1 * poke);
  const date2 = new Date(d2 * poke);

  // 获取年、月、日
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  const day1 = date1.getDate();

  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();

  // 比较年、月、日
  return year1 !== year2 || month1 !== month2 || day1 !== day2;
};
