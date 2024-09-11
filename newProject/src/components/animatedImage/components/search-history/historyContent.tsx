import React, { useEffect, useState } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { typography } from '@/src/theme';
import {
  $SEARCH_COLORS,
  $USE_FONT,
  $flexCenter,
  $flexRow
} from '@/src/theme/variable';
import { Icon } from '@Components/icons';

interface IHistoryContentProps {
  itemKey: number;
  count?: number;
  isDelete?: Boolean;
  isHidden?: Boolean;
  content?: string;
  expand?: Boolean;
  isShowMore?: Boolean;
  onDelete: (id: number) => void;
  onShowMore?: () => void;
  onHidden?: () => void;
  onLayout?: (height: any, width: any, x: any, y: any, key: number) => void;
}

export function HistoryContent(props: IHistoryContentProps) {
  const {
    content,
    itemKey,
    expand = false,
    isShowMore,
    isHidden,
    isDelete,
    count,
    onShowMore,
    onDelete,
    onLayout,
    onHidden
  } = props;

  const [isShow, setIsShow] = useState(false);

  function handleDeleted() {
    if (itemKey !== undefined) {
      onDelete(itemKey);
    }
  }

  function changeIsShowMore() {
    if (onShowMore) {
      onShowMore();
    }
    if (onHidden) {
      onHidden();
    }
  }

  function handleLayout(e: any) {
    const { height, width, x, y } = e.nativeEvent.layout;
    if (onLayout) {
      // console.log(itemKey);

      onLayout(height, width, x, y, itemKey);
    }
  }

  useEffect(() => {
    if (count) {
      if (itemKey <= count || isHidden) {
        setIsShow(false);
      } else if (itemKey > count && !isDelete) {
        setIsShow(true);
      }
    }
  }, [count, isHidden]);

  return (
    <View
      style={[
        $flexCenter,
        $flexRow,
        $contentStyle,
        { paddingRight: isDelete ? 12 : 14 },
        isShow && { display: 'none' }
      ]}
      onLayout={handleLayout}
    >
      {expand ? (
        <>
          {isShowMore ? (
            <Icon
              icon="search_shrink"
              size={16}
              style={{ marginRight: 4, marginLeft: 2 }}
              onPress={changeIsShowMore}
            />
          ) : (
            <Icon
              icon="search_expand"
              size={16}
              style={{ marginRight: 4, marginLeft: 2 }}
              onPress={changeIsShowMore}
            />
          )}
        </>
      ) : (
        <>
          <Text numberOfLines={1} style={$font}>
            {content}
          </Text>
          {isDelete && <Icon icon="close3" size={12} onPress={handleDeleted} />}
        </>
      )}
    </View>
  );
}

const $contentStyle: ViewStyle = {
  height: 32,
  width: 'auto',
  borderWidth: 0.5,
  borderColor: $SEARCH_COLORS.black_10,
  borderRadius: 100,
  gap: 6,
  paddingLeft: 14
};

const $font: TextStyle = {
  ...$USE_FONT(
    $SEARCH_COLORS.black_87,
    typography.fonts.pingfangSC.normal,
    14,
    '400'
  ),
  maxWidth: 140
};
