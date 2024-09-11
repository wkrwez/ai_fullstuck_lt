import { useEffect } from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useConfigStore } from '@/src/store/config';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { RoleItemType } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { useShallow } from 'zustand/react/shallow';
import { FormType, RoleItem, StyleType } from './RoleItem';

const ROLE_LINK = require('@Assets/makephoto/rolelink.png');
const CHANGE_ROLE = require('@Assets/makephoto/btn-changerole1.png');
const CHANGE_ROLE2 = require('@Assets/makephoto/btn-changerole2.png');

type ChangeRoleBtnProps = {
  style?: StyleProp<ViewStyle>;
  type: 'blue' | 'red';
  onPress: () => void;
};
export { StyleType };
function ChangeRoleBtn(props: ChangeRoleBtnProps) {
  return (
    <TouchableOpacity
      style={[{ width: 84, height: 36, zIndex: 999 }, props.style]}
      onPress={() => {
        props.onPress();
        useMakePhotoStoreV2.getState().changePageState(PageState.diy);
      }}
    >
      <Image
        source={props.type === 'blue' ? CHANGE_ROLE : CHANGE_ROLE2}
        style={{ width: '100%', height: '100%' }}
      />
    </TouchableOpacity>
  );
}

const $text: TextStyle = {
  marginTop: 5,
  fontSize: 12,
  color: 'rgba(255,255,255,0.4)',
  textAlign: 'center'
};

interface StyleRolesProps {
  role1: RoleItemType | null;
  role2?: RoleItemType | null;
  index: number;
  useDouble?: boolean;
  styleType?: StyleType;
}
export function StyleRoles(props: StyleRolesProps) {
  // const { role1, role2, index } = useMakePhotoStoreV2(
  //   useShallow(state => ({
  //     role1: state.role1,
  //     role2: state.role2,
  //     index: state.selectedRoleIndex
  //   }))
  // );
  const { role1, role2, index } = props;
  // const { useDouble } = useConfigStore(
  //   useShallow(state => ({
  //     useDouble: state.mode2
  //   }))
  // );

  // const role1Scale = useSharedValue(index === 0 ? 1.2 : 1);
  // const role2Scale = useSharedValue(index === 1 ? 1.2 : 1);

  // const $role1AnimateStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         scale: role1Scale.value
  //       }
  //     ]
  //   };
  // });

  // useEffect(() => {
  //   if (index === 0) {
  //     role1Scale.value = withTiming(1.2, { duration: 300 });
  //     role2Scale.value = withTiming(1, { duration: 300 });
  //   } else {
  //     role1Scale.value = withTiming(1, { duration: 300 });
  //     role2Scale.value = withTiming(1.2, { duration: 300 });
  //   }
  // }, [index]);
  // const $role2AnimateStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         scale: role2Scale.value
  //       }
  //     ]
  //   };
  // });
  //   const { roles } = useConfigStore(
  //     useShallow(state => ({
  //       roles: state.makePhoto?.roles
  //     }))
  //   );
  if (!role2) {
    return (
      <View style={[StyleSheet.rowStyle, { justifyContent: 'center' }]}>
        {role1 && (
          <View>
            <RoleItem
              {...role1}
              checked={true}
              styleType={props.styleType || StyleType.showcrown}
              onChange={() => {}}
              style={{ transform: `scale(0.88)` }}
            />
          </View>
        )}
        {props.useDouble && (
          <TouchableOpacity
            style={{ position: 'absolute', left: '75%' }}
            onPress={onPress}
          >
            <Icon size={40} icon="makephoto_adduser" />
            <Text style={$text}>添加角色</Text>
          </TouchableOpacity>
        )}
        {/* <ChangeRoleBtn
          style={{
            position: 'absolute',
            right: 60,
            top: 90
          }}
          type="blue"
          onPress={() => {
            useMakePhotoStoreV2.getState().setRoleType(0);
          }}
        /> */}
      </View>
    );
  }
  return (
    <View
      style={[
        StyleSheet.rowStyle,
        {
          justifyContent: 'center',
          alignItems: 'center',
          gap: 60
        }
      ]}
    >
      {role1 && (
        <Animated.View>
          <RoleItem
            {...role1}
            checked={index === 0}
            styleType={StyleType.showcrown}
            onChange={() => {}}
            style={{ transform: `scale(0.88)` }}
          />

          {/* <ChangeRoleBtn
            type="red"
            onPress={() => {
              useMakePhotoStoreV2.getState().setRoleType(0);
            }}
          /> */}
        </Animated.View>
      )}

      {/* <Image
        style={{
          width: 115,
          height: 41,
          marginLeft: 20,
          marginRight: 20
        }}
        source={ROLE_LINK}
      /> */}
      {role2 && (
        <Animated.View>
          <RoleItem
            {...role2}
            checked={index === 1}
            styleType={StyleType.text}
            onChange={() => {}}
            style={{ transform: `scale(0.88)` }}
          />
          {/* <ChangeRoleBtn
            type="blue"
            onPress={() => {
              useMakePhotoStoreV2.getState().setRoleType(1);
            }}
          /> */}
        </Animated.View>
      )}
    </View>
  );
  return null;

  function onPress() {
    const { setRoleType, changePageState } = useMakePhotoStoreV2.getState();
    setRoleType(1);
    changePageState(PageState.roleselect);
    reportClick('char_add');
  }
}
