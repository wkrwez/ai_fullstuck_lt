import React, { ForwardedRef } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle
} from 'react-native';
import {
  LayoutProvider,
  MasonryLayoutProvider,
  RecyclerListViewProps
} from 'recyclerlistview-masonrylayoutmanager';
import { IEmptyPlaceHolder } from '../Empty';

export enum RequestScene {
  INIT = 'init',
  REFRESHING = 'refresh',
  LOAD_MORE = 'append'
}

export interface IInfiniteListProps<T> {
  // loading 状态
  loading?: boolean;
  // 列表数据
  data?: T[];
  // error 状态
  error?: Error;
  // 是否还有更多
  hasMore?: boolean;
  // 触发请求回调
  onRequest?: (scene: RequestScene) => Promise<void> | void;
  // 滚动事件回调
  onScroll?: (offset: { offsetX: number; offsetY: number }) => void;

  // 自定义
  customListProps?: Partial<RecyclerListViewProps>;
  // scrollView props 透传
  scrollViewProps?: ScrollViewProps & {
    contentStyle?: StyleProp<ViewStyle>;
    ref?: React.MutableRefObject<ScrollView | null>;
  };
  // 是否开启下拉刷新
  enablePullRefresh?: boolean;
  // 自定义 LayoutProvider
  getLayoutProvider: (data?: T[]) => MasonryLayoutProvider | LayoutProvider;
  // 自定义渲染 footer
  renderFooter?: () => React.JSX.Element | React.JSX.Element[] | null;
  footerStyle?: StyleProp<ViewStyle>;
  // 自定义渲染 item
  renderItem: (
    type: string | number,
    data: T,
    index: number,
    extendedState?: object,
    layoutInfo?: { x: number; y: number }
  ) => React.JSX.Element | React.JSX.Element[] | null;
  // 自定义传参，将透传到 renderItem 方法中
  extendedState?: object;
  // 自定义 loading
  renderLoading?: () => React.JSX.Element | React.JSX.Element[] | null;
  loadingStyle?: StyleProp<ViewStyle>;
  // 自定义 empty
  renderEmpty?: () => React.JSX.Element | React.JSX.Element[] | null;
  customEmptyProps?: IEmptyPlaceHolder;
  // 自定义 contentContainer
  renderContentContainer?: (
    contentContainerProps?: {
      style?: ViewStyle;
    },
    children?: (contentContainerProps?: {
      style?: ViewStyle;
    }) => React.ReactNode
  ) => React.JSX.Element | React.JSX.Element[] | null;
}

export interface InfiniteListRef {
  // 滚动至顶部
  scrollTop: () => void;
}

export type ICustomScrollViewProps = ScrollViewProps & {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  contentStyle: StyleProp<ViewStyle>;
};

export type DataProviderItemType<T> =
  | T
  | {
      type: 'empty';
    };
