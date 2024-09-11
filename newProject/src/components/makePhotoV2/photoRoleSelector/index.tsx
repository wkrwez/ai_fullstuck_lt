import { useConfigStore } from '@/src/store/config';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { RoleItemType } from '@/src/types';
import { reportClick } from '@/src/utils/report';
import {
  IPRoleSelector,
  RoleSelectorFlatList,
  StyleRoles
} from '@Components/roleSelector';
import { useShallow } from 'zustand/react/shallow';

interface RoleSelectorProps {
  disabled?: boolean;
}
export function RoleSelector(props: RoleSelectorProps) {
  const { currentRole, pageState, role1, role2, index } = useMakePhotoStoreV2(
    useShallow(state => ({
      pageState: state.pageState,
      currentRole: state.selectedRoleIndex === 0 ? state.role1 : state.role2,
      role1: state.role1,
      role2: state.role2,
      index: state.selectedRoleIndex
    }))
  );

  const { useDouble } = useConfigStore(
    useShallow(state => ({
      useDouble: state.mode2
    }))
  );

  if (pageState === PageState.roleselect) {
    return (
      <IPRoleSelector
        role={currentRole}
        setRole={setRole}
        onChange={role => {
          useMakePhotoStoreV2.getState().changePageState(PageState.diy);
          reportClick('char_choose', {
            anime_id: role.ip,
            char_id: role.id
          });
        }}
      />
    );
  }

  if (pageState === PageState.styleselect) {
    return (
      <StyleRoles
        role1={role1}
        role2={role2}
        index={index}
        useDouble={useDouble}
      />
    );
  }

  return (
    <RoleSelectorFlatList
      disabled={props.disabled}
      role={currentRole}
      setRole={setRole}
      onChange={() => {}}
    />
  );

  function setRole(payload: RoleItemType) {
    useMakePhotoStoreV2.getState().selectRole(payload);
  }
}
