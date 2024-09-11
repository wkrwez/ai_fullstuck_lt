export function formatNumber(number: bigint | string | number) {
  const num = parseInt(number.toString());

  if (num > 100000) {
    return '10w+';
  } else if (num > 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num > 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num;
  }
}
