import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useConfigStore } from '@/src/store/config';
import { useEmojiStore } from '@/src/store/emoji';
import { useEmojiCreatorStore } from '@/src/store/emoji-creator';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { RoleItemType } from '@/src/types';
import { Icon } from '@Components/icons';
import {
  IPRoleSelector,
  RoleSelectorFlatList,
  StyleRoles
} from '@Components/roleSelector';
import { StyleType } from '@Components/roleSelector/RoleItem';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { Role } from '@step.ai/proto-gen/raccoon/makephoto/makephoto_pb';
import { useShallow } from 'zustand/react/shallow';

export enum RoleSelectorState {
  select = 'select',
  show = 'show'
}
interface RoleSelectorProps {
  state: RoleSelectorState;
  onStateChange: (state: RoleSelectorState) => void;
  role: Role;
  onRoleChange: (role: RoleItemType) => void;
  onSubmit: (role?: RoleItemType) => void;
  disabled?: boolean;
}
export function RoleSelector({
  state,
  onStateChange,
  role,
  onRoleChange,
  onSubmit,
  disabled = false
}: RoleSelectorProps) {
  const { findRole } = useConfigStore(
    useShallow(state => ({
      findRole: state.findRole
    }))
  );
  //   console.log(9999999, role);
  const currentRole = useMemo(() => {
    return (role && findRole(role)) || null;
  }, [role]);

  if (state === RoleSelectorState.select) {
    return (
      <IPRoleSelector
        role={currentRole}
        setRole={onRoleChange}
        onChange={role => {
          onStateChange(RoleSelectorState.show);
          onSubmit(role);
        }}
      />
    );
  }
  return (
    <View>
      <StyleRoles
        styleType={StyleType.hidetext}
        role1={currentRole}
        index={0}
      />
      <Pressable
        style={[st.$dropButton, { opacity: disabled ? 0.6 : 1 }]}
        disabled={disabled}
        onPress={() => {
          onStateChange(RoleSelectorState.select);
        }}
      >
        <Text style={st.$dropButtonText}>更多角色</Text>
        <Icon icon="drop2" size={14} />
      </Pressable>
    </View>
  );

  // function setRole(payload: RoleItemType) {
  //   useEmojiStore.getState().setRoleInfo({
  //     brandType: payload.ip,
  //     role: payload.id
  //   });
  // }
}

const st = StyleSheet.create({
  $dropButton: {
    ...StyleSheet.rowStyle,
    justifyContent: 'center'
  },
  $dropButtonText: {
    color: '#CCE6FF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4
  }
});
