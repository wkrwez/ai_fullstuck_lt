import * as Haptics from 'expo-haptics';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRotateUpdateMethod } from '@/src/hooks/useRotateUpdateMethod';
import { useInputStore } from '@/src/store/input';
import { Image } from '@Components/image';
import { TurnOptions } from './TurnOptions';
import {
  CATE_INNER_RADIUS,
  INNER_RADIUS,
  INNER_ROT,
  ROT,
  TURN_MASK_IMG,
  turnBg
} from './const';
import { createPan, pan } from './pan';
import st from './style';
import { TurnItem, TurnProps } from './types';

export function Turn(props: TurnProps) {
  const { insertNode, currentNode, currentCategory, selectNode } =
    useInputStore(state => ({
      ...state
    }));
  const cateRot = useRotateUpdateMethod({
    radius: CATE_INNER_RADIUS,
    rot: INNER_ROT
  });
  const optRot = useRotateUpdateMethod({
    radius: INNER_RADIUS,
    rot: ROT
  });
  // const [category, setCategory] = useState<string>('exp');

  // 类别列表
  const cateList = useMemo(() => {
    return props.list.map(item => ({
      key: item.key,
      label: item.name,
      id: item.key
    }));
  }, [props.list]);

  // 选项
  const options = useMemo(() => {
    const item = props.list.find(i => i.key === currentCategory);
    console.log('options--------2', currentCategory, item, item && item.list);
    if (!item || !item.list) return [];
    return item.list.map(item => ({
      key: item.name, // TODO
      label: item.name,
      id: item.name // TODO
    }));
  }, [currentCategory, props.list]);

  console.log('options---------', options);
  // useEffect(() => {
  //   if (currentNode) {

  //   }
  //   console.log('currentNode-------', currentNode);
  // }, [currentNode]);

  const pan = createPan(
    (number, inner) => {
      if (inner) {
        cateRot.updateRot(number);
      } else {
        optRot.updateRot(number);
      }
    },
    inner => {
      if (inner) {
        cateRot.gotoNest(2, 5);
      } else {
        optRot.gotoNest(5, options.length + 1);
      }
      Haptics.selectionAsync();
    }
  );

  return (
    <GestureDetector gesture={pan}>
      <View style={st.$wrap}>
        <Image source={turnBg} style={st.$turnBg} />

        <View
          style={[st.$full, st.$cateTurnOptionWrap]}
          pointerEvents="box-none"
        >
          <TurnOptions
            radius={cateRot.radius}
            rotateDeg={cateRot.rotateDeg}
            rotateList={cateRot.rotateList}
            list={cateList}
            type="category"
            onSelect={onSelectItem}
            value={currentCategory}
          />
        </View>
        <View style={[st.$full]} pointerEvents="box-none">
          <TurnOptions
            rotateDeg={optRot.rotateDeg}
            rotateList={optRot.rotateList}
            list={options}
            onSelect={onSelectItem}
            radius={optRot.radius}
            type="option"
            value={currentNode?.content}
          />
        </View>
        <Image source={TURN_MASK_IMG} pointerEvents="none" style={st.$turnBg} />
        {/* <Image source={turnLine} pointerEvents="none" style={st.$turnLine} /> */}
      </View>
    </GestureDetector>
  );

  function onSelectCate(item: TurnItem) {
    if (item.key) {
      selectNode(null, item.key); // todo
      // setCategory(item.key);
    }
  }

  function onSelectItem(item: TurnItem, type: string) {
    Haptics.selectionAsync();
    if (type === 'category') {
      onSelectCate(item);
      selectNode(null, item.id); // toto

      // todo 要改 暂时先满足产品的需要
      const map = {
        expression: 2,
        action: 3,
        cloth: 4,
        scene: 5
      };
      if (item.id) {
        // @ts-ignore
        cateRot.goto(map[item.id]);
      }
    } else {
      const node = {
        type: currentCategory,
        content: item.label
      };
      insertNode(node);
      selectNode(node);
      insertNode({
        type: 'text',
        content: '，'
      });
    }
  }
}
