import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useScreenSize } from '@/src/hooks';
import { useBrandStore } from '@/src/store/brand';
import { useConfigStore } from '@/src/store/config';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { useStorageStore } from '@/src/store/storage';
import { RoleItemType } from '@/src/types';
import { reportClick } from '@/src/utils/report';
import { Icon } from '@Components/icons';
import { PrimaryButton } from '@Components/primaryButton';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { dp2px } from '@Utils/dp2px';
import { logWarn } from '@Utils/error-log';
import { useShallow } from 'zustand/react/shallow';
import { IPTabItem } from './IPTabItem';
import { FormType, RoleItem, StyleType } from './RoleItem';
import { RoleList } from './RoleList';
import { StyleRoles } from './StyleRoles';

interface RoleSelectorProps {
  role: RoleItemType | null;
  setRole: (role: RoleItemType) => void;
  disabled?: boolean;
  onChange: (role: RoleItemType) => void;
}

export function IPRoleSelector(props: RoleSelectorProps) {
  const { IPMap, IPData } = useConfigStore(
    useShallow(state => ({
      IPMap: state.makePhoto?.IPMap,
      IPData: state.makePhoto?.IPData
    }))
  );

  const { ip, role2, role1, selectedRoleIndex, isSwitch } = useMakePhotoStoreV2(
    useShallow(state => ({
      isSwitch: state.isSwitch,
      ip: state.ip,
      role2: state.role2,
      role1: state.role1,
      selectedRoleIndex: state.selectedRoleIndex
    }))
  );

  const selectedRole = useMemo(() => {
    return selectedRoleIndex === 0 ? role2 : role1;
  }, [role2, role1, selectedRoleIndex]);

  const roles = useMemo(() => {
    return IPMap ? IPMap[ip]?.roles : [];
  }, [ip]);

  return (
    <View
      style={[
        StyleSheet.columnStyle,
        { padding: 20, paddingTop: 0, height: '100%' }
      ]}
    >
      {/* tab */}
      <View>
        <ScrollView
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 30
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {IPData &&
            IPData.map(item => (
              <IPTabItem
                active={ip === item.key}
                key={item.key}
                id={item.key}
                text={item.label}
                onPress={(ip: number) => {
                  useMakePhotoStoreV2.getState().setIp(ip);
                  reportClick('ip_choose', { anime_id: ip });
                }}
              />
            ))}
        </ScrollView>
      </View>

      {/* tab end */}
      {/* role */}
      {roles && (
        <RoleList
          selectedRole={selectedRole}
          list={roles}
          value={props.role}
          onChange={props.setRole}
        />
      )}

      <View
        style={[
          StyleSheet.columnStyle,
          {
            position: 'relative',
            zIndex: 9999,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 34,
            marginBottom: 34
          }
        ]}
      >
        <PrimaryButton
          disabled={!props.role}
          onPress={() => {
            if (props.role) {
              props.onChange(props.role);
            }
          }}
        >
          确认选择
        </PrimaryButton>
        {isSwitch && (
          <TouchableOpacity
            style={[StyleSheet.columnStyle, { alignItems: 'center' }]}
            onPress={() => {
              useMakePhotoStoreV2.getState().changePageState(PageState.diy);
            }}
          >
            <>
              <Icon icon="makephoto_up" size={10} style={{ marginTop: 24 }} />
              <Text
                style={{ color: '#CCE6FF', fontSize: 14, fontWeight: '500' }}
              >
                取消切换角色
              </Text>
            </>
          </TouchableOpacity>
        )}
      </View>

      {/* role end */}
    </View>
  );
}

export function AnimatedRoleItem(props: FormType) {
  const scaleValue = useSharedValue(props.checked ? 1 : 0.83);
  const opacityValue = useSharedValue(
    props.checked || !props.disabled ? 1 : 0.1
  );
  const $animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
    transform: [
      {
        scale: scaleValue.value
      }
    ]
  }));
  useEffect(() => {
    if (props.checked) {
      scaleValue.value = withTiming(1, { duration: 300 });
    } else {
      scaleValue.value = withTiming(0.83, { duration: 300 });
    }
  }, [props.checked]);
  return (
    <Animated.View style={$animatedStyle}>
      <RoleItem {...props} />
    </Animated.View>
  );
}

export function RoleSelectorFlatList(props: RoleSelectorProps) {
  const { IPMap } = useConfigStore(
    useShallow(state => ({
      IPMap: state.makePhoto?.IPMap
    }))
  );
  const { ip, selectedRole } = useMakePhotoStoreV2(
    useShallow(state => ({
      ip: state.ip,
      selectedRole: state.selectedRoleIndex === 0 ? state.role2 : state.role1
    }))
  );

  const roles = useMemo(() => {
    return IPMap ? IPMap[ip]?.roles : [];
  }, [ip]);

  // const { roles } = useConfigStore(
  //   useShallow(state => ({
  //     roles: state.makePhoto?.roles
  //   }))
  // );
  const flatlistRef = useRef<FlatList>(null);
  const { width } = useScreenSize();
  let timer: NodeJS.Timeout | undefined = undefined;
  useEffect(() => {
    timer = setTimeout(() => {
      try {
        const index = roles?.findIndex(item => item.id === props.role?.id);
        if (!flatlistRef.current) return;
        flatlistRef.current.scrollToIndex({
          index: Math.max(0, index || 0),
          //     animated?: boolean;
          // viewOffset?: number;
          viewPosition: 0.5
        });
      } catch (error) {
        logWarn('scrollToIndex', error);
      }
    }, 500);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [props.role]);
  return (
    <View
      style={
        (StyleSheet.columnStyle,
        {
          justifyContent: 'center',
          alignItems: 'center'
        })
      }
    >
      <FlatList
        horizontal={true}
        data={roles}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={({ item, index, separators }) => (
          <AnimatedRoleItem
            {...item}
            key={item.key}
            checked={props.role ? props.role.id === item.id : false}
            selected={selectedRole?.id === item.id}
            disabled={props.disabled}
            style={[
              { marginLeft: 12 },
              index === roles.length - 1 && { marginRight: width / 2 - 40 }
            ]}
            styleType={StyleType.hidetext}
            onChange={e => {
              props.setRole(e);
              // props.onChange(e);
            }}
          />
          // <RoleItem
          //   {...item}
          //   key={item.key}
          //   checked={props.role ? props.role.id === item.id : false}
          //   selected={false}
          //   style={{ marginLeft: 12 }}
          //   onChange={e => {
          //     props.setRole(e);
          //     // props.onChange(e);
          //   }}
          // />
        )}
      ></FlatList>
      <TouchableOpacity
        style={[StyleSheet.rowStyle, { marginTop: 5 }]}
        onPress={onChangeIp}
      >
        <Text style={{ color: '#CCE6FF', fontSize: 14, fontWeight: '500' }}>
          切换其他IP角色
        </Text>
        <Icon icon="makephoto_drop" size={12} style={{ marginLeft: 2 }} />
      </TouchableOpacity>
    </View>
  );

  function onChangeIp() {
    useMakePhotoStoreV2.getState().changePageState(PageState.roleselect);
  }

  function getItemLayout(_: unknown, index: number) {
    const itemHeight = dp2px(72); // 假设每个项的高度为50像素
    return {
      length: roles.length,
      offset: (itemHeight + 12) * index,
      index
    };
  }
}

export { StyleRoles };
