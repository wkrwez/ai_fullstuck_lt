export const getMaskStyle = (element: HTMLElement, container: HTMLElement) => {
  if (!element) {
    return {};
  }
  const { height, width, top, left } = element.getBoundingClientRect();
  // 元素顶部相对于滚动容器顶部的距离 = 容器滚动的距离 + 元素距离可视区域顶部的距离
  const elementTopWithScroll = container.scrollTop + top;
  const elementLeftWithScroll = container.scrollLeft + left;

  return {
    width: container.scrollWidth,
    height: container.scrollHeight,
    borderTopWidth: Math.max(elementTopWithScroll, 0),
    borderLeftWidth: Math.max(elementLeftWithScroll, 0),
    // 元素完整内容高度 - 元素本身的高度 - 元素顶部相对于滚动容器顶部的距离
    borderBottomWidth: Math.max(
      container.scrollHeight - height - elementTopWithScroll,
      0,
    ),
    borderRightWidth: Math.max(
      container.scrollWidth - width - elementLeftWithScroll,
      0,
    ),
  };
};
