import { useMemoizedFn } from 'ahooks';
import {
  ForwardedRef,
  LegacyRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleProp,
  Text,
  View,
  ViewStyle
} from 'react-native';
import {
  BaseLayoutProvider,
  DataProvider,
  LayoutProvider,
  RecyclerListView
} from 'recyclerlistview-masonrylayoutmanager';
import { CommonColor } from '@/src/theme/colors/common';
import { getScreenSize } from '@/src/utils';
import { EmptyPlaceHolder } from '../Empty';
import { ScrollEvent } from 'recyclerlistview-masonrylayoutmanager/dist/reactnative/core/scrollcomponent/BaseScrollView';
import {
  DataProviderItemType,
  ICustomScrollViewProps,
  IInfiniteListProps,
  InfiniteListRef,
  RequestScene
} from './typing';

const SCROLL_REQUEST_THRESHOLD = 320;
const SCROLL_REQUEST_BOTTOM_DISTANCE = 10;
const SCROLL_THROTTLE = 16;

const getEmptyLayoutProvider = () =>
  new LayoutProvider(
    () => {
      return 'Empty';
    },
    (type, dim) => {
      dim.width = getScreenSize('width');
      dim.height = 1;
    }
  );

function InfiniteListView<T>(
  props: IInfiniteListProps<T>,
  ref: ForwardedRef<InfiniteListRef>
) {
  const {
    data,
    loading,
    error,
    hasMore,
    footerStyle: $customFooterStyle,
    getLayoutProvider,
    onRequest,
    enablePullRefresh = true
  } = props;

  const [dataProvider, setDataProvider] = useState(
    new DataProvider(
      (r1: DataProviderItemType<T>, r2: DataProviderItemType<T>) => {
        return r1 !== r2;
      }
    )
  );
  const [layoutProvider, setLayoutProvider] = useState<BaseLayoutProvider>(
    getLayoutProvider(data)
  );

  const scrollY = useRef<number>(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const needRestoreFirstItemExpo = useRef(false);

  const onScroll = useMemoizedFn(
    (rawEvent: ScrollEvent, offsetX: number, offsetY: number) => {
      const { nativeEvent } = rawEvent;
      const total =
        nativeEvent.contentOffset.y +
        (nativeEvent.layoutMeasurement?.height || 0);
      if (
        total + SCROLL_REQUEST_THRESHOLD >
          +(nativeEvent.contentSize?.height || 0) &&
        offsetY > scrollY.current &&
        hasMore
      ) {
        onRequest?.(RequestScene.LOAD_MORE);
      }
      scrollY.current = offsetY;

      props.onScroll?.({
        offsetX,
        offsetY
      });
    }
  );

  const onReachListEnd = () => {
    hasMore && onRequest?.(RequestScene.LOAD_MORE);
  };

  const renderItem = useMemoizedFn(renderItemWrapper);

  const onVisibleIndicesChangedWrapper = (
    all: number[], // 所有当前可见的 item index
    now: number[], // 进场 item index
    notNow: number[] // 出场 item index
  ) => {
    if (all.length === 1 && !data?.length) {
      // 实际为empty
      needRestoreFirstItemExpo.current = true;
      props.customListProps?.onVisibleIndicesChanged?.([], [], []);
      return;
    }

    if (needRestoreFirstItemExpo.current) {
      props.customListProps?.onVisibleIndicesChanged?.(
        all,
        [0, ...now],
        notNow
      );
    } else {
      props.customListProps?.onVisibleIndicesChanged?.(all, now, notNow);
    }
    needRestoreFirstItemExpo.current = false;
  };

  useEffect(() => {
    if (data?.length) {
      const source = dataProvider.cloneWithRows(data);
      setDataProvider(source);
      setLayoutProvider(getLayoutProvider(data || []));
    } else {
      const placeholderData = [{ type: 'empty' }];
      const source = dataProvider.cloneWithRows(placeholderData);
      setDataProvider(source);
      setLayoutProvider(getEmptyLayoutProvider());
    }
  }, [data, getLayoutProvider]);

  useImperativeHandle(
    ref,
    () => ({
      scrollTop: () => {
        scrollViewRef.current?.scrollTo(0);
      }
    }),
    []
  );

  return (
    <RecyclerListView
      extendedState={props.extendedState}
      renderAheadOffset={250}
      onEndReached={onReachListEnd}
      onEndReachedThreshold={SCROLL_REQUEST_BOTTOM_DISTANCE}
      dataProvider={dataProvider}
      layoutProvider={layoutProvider}
      rowRenderer={renderItem}
      renderFooter={renderFooter}
      renderContentContainer={renderContentContainer}
      scrollThrottle={SCROLL_THROTTLE}
      onScroll={onScroll}
      // @ts-ignore
      externalScrollView={CustomScrollView}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        onRefresh: enablePullRefresh
          ? () => onRequest?.(RequestScene.REFRESHING)
          : undefined,
        ...props.scrollViewProps,
        ref: (node: ScrollView) => {
          scrollViewRef.current = node;
          if (props.scrollViewProps?.ref !== undefined) {
            props.scrollViewProps.ref.current = node;
          }
        }
      }}
      {...props.customListProps}
      onVisibleIndicesChanged={onVisibleIndicesChangedWrapper}
    />
  );

  /**
   * 页脚元素
   * @returns
   */
  function renderFooter() {
    if (props.renderFooter) {
      return props.renderFooter();
    }

    const hasContent = Boolean(data?.length);

    if (loading && hasContent) {
      return (
        <ActivityIndicator
          size="small"
          style={[{ margin: 10 }, $customFooterStyle]}
          color="rgba(217, 217, 217, 1)"
        />
      );
    }
    if (!hasMore && hasContent) {
      return (
        <View
          style={[
            {
              alignItems: 'center',
              marginTop: 12
            },
            $customFooterStyle
          ]}
        >
          <Text style={{ color: CommonColor.black40 }}>小狸是有底线的~</Text>
        </View>
      );
    }
    if (error && hasContent) {
      return (
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 12
            },
            $customFooterStyle
          ]}
        >
          <Text style={{ color: CommonColor.black40 }}>小狸走丢了，</Text>
          <Pressable
            onPress={() => {
              onRequest?.(RequestScene.LOAD_MORE);
            }}
          >
            <Text style={{ color: CommonColor.red }}>重试</Text>
          </Pressable>
        </View>
      );
    }
    return <View style={[{ height: 30 }, $customFooterStyle]}></View>;
  }

  /**
   * content 容器
   */
  function renderContentContainer(
    contentContainerProps?: { style?: ViewStyle },
    children?: React.ReactNode
  ) {
    if (props.renderContentContainer) {
      return props.renderContentContainer(contentContainerProps, props =>
        defaultRenderContentContainer(props, children)
      );
    } else {
      return defaultRenderContentContainer(contentContainerProps, children);
    }
  }

  function defaultRenderContentContainer(
    contentContainerProps?: { style?: ViewStyle },
    children?: React.ReactNode
  ) {
    if (loading && data?.length === 0) {
      return props.renderLoading?.() || <Text>加载中</Text>;
    }

    if (error && data?.length === 0) {
      return (
        <EmptyPlaceHolder
          style={{ height: 400 }}
          buttonText="刷新"
          button={Boolean(onRequest)}
          onButtonPress={() => onRequest?.(RequestScene.INIT)}
        >
          哎呀，小狸走丢了
        </EmptyPlaceHolder>
      );
    }

    if (data?.length === 0) {
      if (props.renderEmpty) {
        return props.renderEmpty();
      }
      const { children, style, ...rest } = props.customEmptyProps || {};
      return (
        <EmptyPlaceHolder style={[{ height: 400 }, style]} {...rest}>
          {children || '小狸两手空空哦~'}
        </EmptyPlaceHolder>
      );
    }

    return <View style={[contentContainerProps?.style]}>{children}</View>;
  }

  function renderItemWrapper(
    type: string | number,
    data: T,
    index: number,
    extendedState?: object
  ) {
    // tricky：外部有需要判断 item 所处的 column index，因此这里暴露 item 的 layout 信息
    // @ts-ignore
    const { x, y } = this || {};
    return props.renderItem(type, data, index, extendedState, { x, y });
  }
}

export const InfiniteList = forwardRef(InfiniteListView) as <T>(
  props: IInfiniteListProps<T> & {
    ref?: ForwardedRef<InfiniteListRef>;
  }
) => ReturnType<typeof InfiniteListView>;

const CustomScrollView = forwardRef(
  (
    {
      children,
      onRefresh,
      bounces,
      contentStyle,
      ...props
    }: ICustomScrollViewProps,
    ref: LegacyRef<ScrollView>
  ) => {
    const [refreshing, setRefreshing] = useState(false);

    return (
      <ScrollView
        ref={ref}
        bounces={bounces}
        {...props}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                if (bounces === false) return; //避免鬼畜更新
                try {
                  setRefreshing(true);
                  await onRefresh();
                } finally {
                  setRefreshing(false);
                }
              }}
            />
          ) : undefined
        }
      >
        <View style={contentStyle}>{children}</View>
      </ScrollView>
    );
  }
);
