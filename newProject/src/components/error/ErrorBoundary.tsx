import * as Clipboard from 'expo-clipboard';
import {
  ErrorBoundaryProps,
  ErrorBoundary as ExpoErrorBoundary
} from 'expo-router';
import { useEffect } from 'react';
import { Alert, View } from 'react-native';
import { useAppStore } from '@/src/store/app';
import { logWarn } from '@/src/utils/error-log';
import { Button } from '../button';
import { getSettingsPagePublicInfo } from '@step.ai/app-info-module';

export function ErrorBoundary({ error, ...restProps }: ErrorBoundaryProps) {
  const user = useAppStore(state => state.user);
  const message =
    error.message +
    '\n' +
    (error.stack || '') +
    '\n------------\n' +
    getSettingsPagePublicInfo() +
    '\n' +
    'time: ' +
    new Date().toString() +
    '\nuid:' +
    (user?.uid || '');

  useEffect(() => {
    logWarn('GlobalErrorBoundary', error, 'GlobalErrorBoundary', true);
  }, [error]);

  return (
    <>
      <ExpoErrorBoundary error={error} {...restProps} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={async () => {
            await Clipboard.setStringAsync(message);
            Alert.alert('复制上报错误信息成功，您可以点击Retry重试');
          }}
        >
          点击复制错误信息
        </Button>
      </View>
    </>
  );
}
