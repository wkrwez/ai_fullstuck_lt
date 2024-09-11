import { useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { IOScrollView } from 'react-native-intersection-observer';
import { Icon, SheetModal } from '@/src/components';
import { useDetailStore } from '@/src/store/detail';
import { colors, spacing } from '@/src/theme';
import { darkSceneColor, lightSceneColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { StyleSheet } from '@/src/utils';
import { CommentInput } from './Input';
import { CommentList } from './List';
import { CommentEvent, CommentEventBus } from './eventbus';

interface CommentModalProps {
  theme?: Theme;
  visible?: boolean;
  onClose?: () => void;
  detailId: string;
  headerSlot?: React.ReactNode;
}

export const CommentModal = ({
  theme = Theme.LIGHT,
  visible = false,
  onClose,
  detailId,
  headerSlot
}: CommentModalProps) => {
  const commonInfo = useDetailStore(state => {
    const info = state.getDetail(detailId);
    return info?.commonInfo;
  });

  // 目前 SheetModal 使用 absolute + bottom 进行定位， 当键盘唤起时，CommentModal 也会被顶起，需要改用 top 进行定位
  const [isPositionTop, setIsPositionTop] = useState(false);
  const positionFlagEleTop = useRef<number | undefined>();
  const positionFlagEleRef = useRef<View>(null);

  const themeConfig = theme === Theme.LIGHT ? lightSceneColor : darkSceneColor;
  const displayCommentCountStr = Boolean(Number(commonInfo?.stat?.comments))
    ? commonInfo?.stat?.comments.toString()
    : '';

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const offsetY = contentOffset.y;
    const contentHeight = contentSize.height;
    const scrollHeight = layoutMeasurement.height;

    if (scrollHeight + offsetY > contentHeight - 200) {
      CommentEventBus.emit('scrollComment');
    }
  };

  const handleClose = () => {
    setIsPositionTop(false);
    onClose?.();
  };

  const onModalShown = () => {
    positionFlagEleRef.current?.measure((x, y, widht, height, left, top) => {
      positionFlagEleTop.current = top;
    });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onInputStateChange = ({ isFocus }: { isFocus: boolean }) => {
      if (isFocus) {
        setIsPositionTop(true);
      } else {
        // 键盘回缩需要时间，等待300ms后恢复
        timer = setTimeout(() => {
          setIsPositionTop(false);
        }, 300);
      }
    };
    CommentEventBus.on(
      CommentEvent.COMMENT_INPUT_STATE_CHANGE,
      onInputStateChange
    );

    return () => {
      CommentEventBus.off(
        CommentEvent.COMMENT_INPUT_STATE_CHANGE,
        onInputStateChange
      );
      clearTimeout(timer);
    };
  }, []);

  return (
    <SheetModal
      isVisible={visible}
      onClose={handleClose}
      onShowAnimationDone={onModalShown}
      remainHeight={0}
      maskShown={true}
      theme={theme}
      style={
        isPositionTop && Boolean(positionFlagEleTop.current)
          ? {
              bottom: 'auto',
              top: positionFlagEleTop.current
            }
          : undefined
      }
      portalProps={{
        hostName: 'CommentPortalHost'
      }}
    >
      <View style={$header} ref={positionFlagEleRef}>
        {headerSlot}
        <Text style={$headerTitle}>评论 {displayCommentCountStr}</Text>
        <View style={[$closeBtn, { backgroundColor: themeConfig.eleBg }]}>
          <Icon
            color={themeConfig.fontColor2}
            icon="close_outline"
            size={18}
            hitSlop={spacing.xs}
            onPress={handleClose}
          />
        </View>
      </View>
      <IOScrollView
        style={[adaptiveStyle.$commentListScrollView, $commentListScrollView]}
        onScroll={onScroll}
      >
        <CommentList
          emptycontainerStyle={{
            minHeight: adaptiveStyle.$commentListScrollView.height
          }}
          theme={theme}
          detailId={detailId}
        />
      </IOScrollView>
      <View
        style={[
          $inputWrapper,
          {
            borderColor: themeConfig.border
          }
        ]}
      >
        <CommentInput theme={theme} detailId={detailId} />
      </View>
    </SheetModal>
  );
};

const $inputWrapper: ViewStyle = {
  borderTopWidth: 0.5,
  paddingTop: 12,
  paddingBottom: 0
};

const $header: ViewStyle = {
  paddingVertical: 18,
  paddingHorizontal: 16
};

const $closeBtn: ViewStyle = {
  position: 'absolute',
  right: 12,
  top: 12,
  borderRadius: 100,
  padding: 4
};

const $headerTitle: TextStyle = {
  fontSize: 14,
  fontWeight: '500',
  color: colors.white,
  textAlign: 'center',
  lineHeight: 18
};

const $commentListScrollView: ViewStyle = {
  paddingHorizontal: 16
};

const adaptiveStyle = StyleSheet.create({
  $commentListScrollView: {
    height: 420
  }
});
