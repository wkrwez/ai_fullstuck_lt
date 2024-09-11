import { useCallback, useEffect, useState } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { Icon, showConfirm } from '@/src/components';
import { typography } from '@/src/theme';
import { CommonColor } from '@/src/theme/colors/common';
import {
  $SEARCH_COLORS,
  $USE_FONT,
  $flexCenter,
  $flexHBetween,
  $flexRow
} from '@/src/theme/variable';
import { HistoryContent } from './historyContent';

export function History({ props }) {
  const [isDelete, setIsdelete] = useState(false); //控制删除态
  const [list, setList] = useState([
    {
      id: 1,
      name: '而呃呃色上热搜他说ddddddddd'
    },
    {
      id: 2,
      name: '李四'
    },
    {
      id: 3,
      name: '王五大哈'
    },
    {
      id: 4,
      name: '赵六'
    },
    {
      id: 5,
      name: '田七asada'
    },
    {
      id: 6,
      name: '八啊大大大大大收拾收拾睡'
    },
    {
      id: 7,
      name: '九啊dqqaaaaaaaaaaaaaaaa'
    },
    {
      id: 8,
      name: '我'
    },
    {
      id: 9,
      name: '田七saaaaa'
    },
    {
      id: 10,
      name: '八啊'
    },
    {
      id: 11,
      name: '九啊大我亲亲亲亲亲啊啊啊'
    },
    {
      id: 12,
      name: 'adasd啊啊啊'
    },
    {
      id: 13,
      name: 'qa'
    },
    {
      id: 14,
      name: 'bbb'
    },
    {
      id: 15,
      name: 'ccaaass'
    },
    {
      id: 16,
      name: 'q'
    },
    {
      id: 17,
      name: 'bbbbaaaaaaa'
    },
    {
      id: 18,
      name: 'cccccccc'
    }
  ]);
  const [isShowMore, setIsShowMore] = useState(false); //切换展开收缩icon
  const [isHidden, setIsHidden] = useState(false); //控制设有隐藏css属性的子组件
  const [isExpand, setIsExpand] = useState(false); //控制展开收缩的显示
  const [count, setCount] = useState(0); //确定第三行显示的最后一个
  const [num, setNum] = useState(0); //记录第三行的个数
  const [visition, setVisitation] = useState(false); //防止刚开始加载的闪动
  const [layoutCount, setLayoutCount] = useState(0); //记录第四行的数量
  const [myKey, setMyKey] = useState(0); //存储第三行第一个的key
  const $opacity = useSharedValue(0);
  const opacityStyle = useAnimatedStyle(() => ({ opacity: $opacity.value }));
  const handleDelete = (index: number) => {
    setList(prevList => {
      const newList = [...prevList];
      newList.splice(index, 1);
      return newList;
    });

    props?.handleDelete();
  };

  const handleAllDelete = useCallback(() => {
    showConfirm({
      title: '是否全部删除？',
      confirmText: '确认',
      confirmTextStyle: { color: CommonColor.brand1 },
      cancelText: '取消',
      onConfirm: ({ close }) => {
        {
          setList([]);

          close();
        }
      },
      onClose() {
        return;
      }
    });
    props?.handleAllDelete();
    //如果每添加一条数据就刷新页面，那就不需要这些
    setCount(0);
    setNum(0);
    setLayoutCount(0);
    setMyKey(0);
  }, []);
  //切换展开，收缩
  const handleShowMore = () => {
    setIsShowMore(!isShowMore);
  };

  const handleHidden = () => {
    setIsHidden(!isHidden);
  };

  const handleLayout = (
    height: any,
    width: any,
    x: any,
    y: any,
    key: number
  ) => {
    //记录第四行的内容数量
    if (y === 3 * (height + 12) && !isDelete) {
      setLayoutCount(pre => pre + 1);
    }
    // 记录第三行的首个内容的下标
    if (y === 2 * (height + 12) && x === 0) {
      setMyKey(key);
    }
    //计算第三行的内容个数
    if (y === 2 * (height + 12)) {
      setNum(pre => pre + 1);
    }
    //超出第五行，把小于第六行第一个的保留
    if (y > 4 * (height + 12) && x === 0 && !isDelete) {
      setList(list.filter((item, index) => index < key - 1));
    }
  };
  function handleFatherLayout(e: any) {
    // 第四行有内容并且不是删除态
    if (layoutCount > 0 && !isDelete && count === 0) {
      setIsExpand(true);
    }
    //第四行没有内容，list小于key说明内容没有超出第三行
    if (layoutCount === 0 || list.length <= count + 1) {
      setIsExpand(false);
      setIsHidden(true);
    }

    // 确定key,当第四行的数量大于0且key还未确定，说明第一次加载，计算第三行的内容数量减去一个给展开符让出位置
    if (layoutCount > 0 && count === 0) {
      setCount(myKey + num - 2);
    }

    setVisitation(true);
  }

  //点击完成
  function handleFinish() {
    setIsdelete(!isDelete);
    if (count) {
      setIsExpand(true);
    }
    setIsShowMore(false);
    handleHidden();
    //删除完成后当数量不会超出第四行就isHidden把所有都展示并且去除展开符，奇怪就是list长度多了1。
    if (count && list.length <= count + 2) {
      setIsExpand(false);
      setIsHidden(true);
    }
  }
  //展示删除态，展示所有存在项
  function changeDelete() {
    setIsdelete(!isDelete);
    setIsExpand(false);
    setIsHidden(true);
  }

  const opacityAnimation = () => {
    $opacity.value = withTiming(1, { duration: 1000, easing: Easing.linear });
  };

  useEffect(() => {
    //等待DOM完成布局
    if (visition) {
      opacityAnimation();
    }
  }, [visition]);

  return (
    <Animated.View style={[$history, opacityStyle]}>
      <View style={[$flexHBetween, $header]}>
        <Text style={$historyText}>历史记录</Text>
        {isDelete ? (
          <View style={[$flexCenter, $flexRow, { gap: 12 }]}>
            <Text
              onPress={handleAllDelete}
              style={[$historyDelete, $allDelete]}
            >
              全部删除
            </Text>
            <Text style={$separatete}></Text>
            <Text
              style={[$historyDelete, $finish]}
              onPress={() => {
                handleFinish();
              }}
            >
              完成
            </Text>
          </View>
        ) : (
          <Icon
            icon="delete_historySearch"
            size={16}
            onPress={changeDelete}
          ></Icon>
        )}
      </View>
      <View
        style={[
          $flexRow,
          $historyContent,
          {
            marginRight: 30
          }
        ]}
        onLayout={handleFatherLayout}
      >
        {list.map((item, index) => {
          return (
            <HistoryContent
              content={item.name}
              isHidden={isHidden}
              onHidden={handleHidden}
              onDelete={handleDelete}
              itemKey={index}
              onLayout={handleLayout}
              isDelete={isDelete}
              count={count}
            />
          );
        })}

        {isExpand && (
          <HistoryContent
            onDelete={handleDelete}
            expand={isExpand}
            itemKey={1}
            isShowMore={isShowMore}
            onShowMore={handleShowMore}
            isHidden={isHidden}
            onHidden={handleHidden}
          />
        )}
      </View>
    </Animated.View>
  );
}

const $history: ViewStyle = {
  paddingLeft: 20,
  marginTop: 10,
  marginBottom: 7
};

const $header: ViewStyle = {
  marginBottom: 16,
  height: 30,
  marginRight: 16
};

const $historyText: TextStyle = {
  ...$USE_FONT(
    $SEARCH_COLORS.black_87,
    typography.fonts.pingfangSC.normal,
    15,
    '400'
  )
};

const $historyDelete: TextStyle = {
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 13,
  lineHeight: 30,
  height: 30
};

const $allDelete: TextStyle = {
  width: 53,
  color: $SEARCH_COLORS.black_40,
  fontWeight: '400'
};

const $separatete: TextStyle = {
  width: 1,
  height: 10,
  backgroundColor: $SEARCH_COLORS.black_16
};
const $finish: TextStyle = {
  width: 30,
  textAlign: 'center',
  color: CommonColor.black,
  fontWeight: '500'
};

const $historyContent: ViewStyle = {
  gap: 12,
  flexWrap: 'wrap'
};
