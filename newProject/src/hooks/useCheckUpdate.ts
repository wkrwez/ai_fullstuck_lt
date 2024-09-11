import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { appInfoClient } from '@/src/api/appinfo';
import { showToast } from '@Components/toast';
import { ErrorRes } from '../api/websocket/stream_connect';
import { useAppStore } from '../store/app';
// import { UpdateStatus } from '@step.ai/proto-gen/raccoon/app/v1/app_info_pb';
import { useStorageStore } from '../store/storage';
import { AppInfo } from '@/proto-registry/src/web/raccoon/appinfo/appinfo_connect';
import { CheckUpdateRes } from '@/proto-registry/src/web/raccoon/appinfo/appinfo_pb';
import { UpdateStatus } from '@/proto-registry/src/web/raccoon/appinfo/common_pb';
import { useShallow } from 'zustand/react/shallow';

export const useAppUpdateInfo = () => {
  const { url, versionNumText, releaseNotes } = useAppStore(
    useShallow(state => ({
      url: state?.updateInfo?.url ?? '',
      versionNumText: `V${state?.updateInfo?.latestSource?.version}`,
      releaseNotes:
        state?.updateInfo?.releaseNotes
          ?.split('\n')
          .filter(text => Boolean(text)) ?? []
    }))
  );
  const goToUpdate = () => {
    if (url) {
      Linking.openURL(url);
    }
  };
  return {
    goToUpdate,
    releaseNotes,
    versionNumText
  };
};

export const useAppUpdateGlobal = () => {
  const checkUpdate = useAppStore(state => state.checkUpdate);
  const { goToUpdate } = useAppUpdateInfo();
  const checkUpdateForce = useCallback(() => {
    return checkUpdate()
      .then(updateInfo => {
        if (updateInfo.forceUpdate === UpdateStatus.FORCE) {
          goToUpdate();
        }
      })
      .catch((e: ErrorRes) => {
        console.log('checkUpdate error', e);
      });
  }, []);
  return {
    checkUpdate: checkUpdateForce
  };
};

export const useJumpUpdate = () => {
  const forceUpdate = useAppStore(state => state?.updateInfo?.forceUpdate);
  const { goToUpdate } = useAppUpdateInfo();
  const jump = () => {
    if (forceUpdate && forceUpdate === UpdateStatus.OPTION) {
      goToUpdate();
    } else {
      showToast('已经是最新的版本');
    }
  };

  return jump;
};

export const useAppUpdateInfoModal = () => {
  const updateInfo = useAppStore(state => state.updateInfo);
  const { __setStorage, skipUpdateVersion } = useStorageStore(
    useShallow(state => ({
      __setStorage: state.__setStorage,
      skipUpdateVersion: state.skipUpdateVersion
    }))
  );
  const [isVisible, setIsVisible] = useState(false);
  const { goToUpdate, releaseNotes, versionNumText } = useAppUpdateInfo();

  const onClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (updateInfo?.forceUpdate) {
      if (updateInfo.forceUpdate === UpdateStatus.FORCE) {
        setIsVisible(true);
      } else if (
        updateInfo?.latestSource?.version &&
        skipUpdateVersion !== updateInfo.latestSource.version
      ) {
        setIsVisible(true);
        // 显示过就进行记录，下次打开不再显示
        __setStorage({
          skipUpdateVersion: updateInfo.latestSource.version
        });
      }
    }
  }, [updateInfo, skipUpdateVersion]);

  return {
    isVisible,
    updateInfo,
    goToUpdate,
    releaseNotes,
    onClose,
    versionNumText
  };
};
