import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { router } from 'expo-router';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  TouchableOpacity,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { deleteEmoji } from '@/src/api/emoji';
import { selectState } from '@/src/store/_utils';
import { useEmojiStore } from '@/src/store/emoji';
import { darkSceneColor, lightSceneColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { StyleSheet, createStyle } from '@/src/utils';
import { logWarn } from '@/src/utils/error-log';
import { reportClick } from '@/src/utils/report';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { AbsolutePopover } from '../popover';
import { EmojiInfo } from '@step.ai/proto-gen/raccoon/emoji/emoji_pb';
import { useShallow } from 'zustand/react/shallow';

const CREATE_BUTTON = require('@Assets/emoji/btn_create.png');

const getPopPosition = (layout: Layout) => {
  return {
    bottom: screen.height - layout.y + (Platform.OS === 'ios' ? 10 : -20),
    left:
      layout.x +
      (layout.width -
        (popStyle.$image.width + popStyle.$container.padding * 2)) /
        2
  };
};

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

const screen = Dimensions.get('screen');

interface Props {
  height: number; // 键盘高度
  theme?: Theme;
  onSelect: (emoji: EmojiInfo) => void;
  onDelete?: (emoji: EmojiInfo) => void;
  dismiss: () => void;
}

export const CustomKeyboard = ({
  height: keyboardHeight,
  // onCreate,
  theme = Theme.LIGHT,
  onSelect,
  onDelete,
  dismiss
}: Props) => {
  const isLight = theme === Theme.LIGHT;
  const themeConfig = isLight ? lightSceneColor : darkSceneColor;

  const { init, mineEmoji, recommendEmoji, minePagin, getMyEmojiList } =
    useEmojiStore(
      useShallow(state =>
        selectState(state, [
          'init',
          'mineEmoji',
          'recommendEmoji',
          'minePagin',
          'getMyEmojiList'
        ])
      )
    );

  const { run: debounceScrollEnd } = useDebounceFn(
    () => {
      if (minePagin?.nextCursor) {
        getMyEmojiList({
          pagination: {
            cursor: minePagin.nextCursor,
            size: minePagin.size || 20
          }
        });
      }
    },
    {
      wait: 300
    }
  );

  const handleCreate = () => {
    dismiss();
    reportClick('emoji_create_button');
    router.push(`/emoji/create`);
  };

  const [poppedEmoji, setPoppedEmoji] = useState<EmojiInfo | null>(null);
  const [poppedEmojiLayout, setPoppedEmojiLayout] = useState<Layout | null>();

  const handleDelete = async () => {
    try {
      if (poppedEmoji) {
        const res = await deleteEmoji({ emojiId: poppedEmoji?.emojiId });
        console.log('del res----->', res);

        onDelete && onDelete(poppedEmoji);

        setPoppedEmoji(null);

        await init();
      }
    } catch (e) {
      logWarn('handleDelete', e);
      console.log('handleDelete payload------->', poppedEmoji?.emojiId);
    }
  };

  const handleSelectEmoji = useMemoizedFn((e: EmojiInfo) => {
    if (e.emojiId !== poppedEmoji?.emojiId) {
      clearPopInfo();
      onSelect(e);
    } else {
      clearPopInfo();
    }
  });

  const handlePopEmoji = useMemoizedFn(
    (e: EmojiInfo, instance: View | undefined) => {
      instance?.measure((fx, fy, width, height, px, py) => {
        setPoppedEmoji(e);
        setPoppedEmojiLayout({
          x: px,
          y: py,
          width,
          height
        });
      });
    }
  );

  const clearPopInfo = () => {
    setPoppedEmoji(null);
    setPoppedEmojiLayout(null);
  };

  // 没有数据时初始化
  useEffect(() => {
    if (!mineEmoji.length) {
      useEmojiStore.getState().init();
    }
  }, []);

  return (
    <>
      <View
        style={[
          { height: keyboardHeight || 340 },
          st.$containerStyle,
          { backgroundColor: themeConfig.bg2 }
        ]}
      >
        {/* <View style={st.$indicatorWrap}>
          <View style={st.$indicator}></View>
        </View> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={debounceScrollEnd}
          onScroll={clearPopInfo}
        >
          <Text style={[st.$label, { color: themeConfig.fontColor2 }]}>
            我的表情
          </Text>
          <View style={st.$emojiList}>
            <CreateButton onPress={handleCreate} />
            {mineEmoji?.map((item, index) => {
              return (
                <EmojiItem
                  item={item}
                  key={item.emojiId}
                  onSelect={handleSelectEmoji}
                  isPopVisible={item.emojiId === poppedEmoji?.emojiId}
                  onLongPress={handlePopEmoji}
                />
              );
            })}
          </View>
          {!minePagin.nextCursor && (
            <>
              <Text style={[st.$label, { color: themeConfig.fontColor2 }]}>
                推荐表情
              </Text>
              <View style={st.$emojiList}>
                {recommendEmoji?.map((item, index) => (
                  <EmojiItem
                    item={item}
                    key={item.emojiId}
                    onSelect={onSelect}
                  />
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
      {poppedEmoji && poppedEmojiLayout && (
        <AbsolutePopover
          visible
          theme={theme}
          containerStyle={{ padding: 0 }}
          popStyle={getPopPosition(poppedEmojiLayout)}
          content={
            <View>
              <View style={popStyle.$container}>
                <Image
                  style={popStyle.$image}
                  source={poppedEmoji?.wholeImageUrl}
                  tosSize="size4"
                ></Image>
              </View>
              <Pressable style={popStyle.$btn} onPress={handleDelete}>
                <Text
                  style={[popStyle.$btnText, { color: themeConfig.fontColor }]}
                >
                  删除表情
                </Text>
              </Pressable>
            </View>
          }
        ></AbsolutePopover>
      )}
    </>
  );
};

interface CreateButtonProps {
  onPress: () => void;
}
function CreateButton({ onPress }: CreateButtonProps) {
  return (
    <TouchableOpacity style={st.$emojiItem} onPress={onPress}>
      <Image source={CREATE_BUTTON} style={{ width: '100%', height: '100%' }} />
    </TouchableOpacity>
  );
}

interface EmojiItemProps {
  item: EmojiInfo;
  onSelect?: (emoji: EmojiInfo) => void;
  onLongPress?: (emoji: EmojiInfo, instance: View | undefined) => void;
  isPopVisible?: boolean;
}
function EmojiItem({
  item,
  onSelect,
  onLongPress,
  isPopVisible = false
}: EmojiItemProps) {
  const viewRef = useRef<View>();
  return (
    <TouchableOpacity
      style={st.$emojiItem}
      onPress={() => {
        onSelect && onSelect(item);
      }}
      onLongPress={e => {
        onLongPress && onLongPress(item, viewRef.current);
      }}
    >
      <View style={st.$emojiItemWrap} ref={viewRef as MutableRefObject<View>}>
        <Image
          source={item.wholeImageUrl}
          style={{ width: '100%', height: '100%' }}
          tosSize="size4"
        />
      </View>
    </TouchableOpacity>
  );
}

const st = StyleSheet.create({
  $indicatorWrap: {
    position: 'relative',
    paddingVertical: 6,
    left: 0,
    right: 0,
    ...StyleSheet.rowStyle,
    justifyContent: 'center'
  },
  $indicator: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E3E3E3'
  },
  $containerStyle: {
    position: 'relative',
    backgroundColor: '#F4F4F5',
    paddingTop: 0,
    paddingBottom: 20
  },
  $label: {
    opacity: 0.8,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 16
  },
  $emojiList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
    marginTop: 12,
    paddingLeft: 16
  },
  $emojiItem: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginBottom: 8
  },
  $emojiItemWrap: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden'
  }
});

const popStyle = StyleSheet.create({
  $container: { padding: 8, borderBottomWidth: 0.5, borderColor: '#E7E7E7' },
  $image: { width: 120, height: 120 },
  $btn: { padding: 8, alignItems: 'center' },
  $btnText: { fontSize: 13, fontWeight: '500', opacity: 0.7 }
});
