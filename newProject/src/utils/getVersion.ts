import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const getVersionStr = () => {
    let versionStr = Constants.expoConfig?.version;
    switch (Platform.OS) {
      case 'android':
        versionStr += ` (${Constants.expoConfig?.android?.versionCode})`;
        break;
      case 'ios':
        versionStr += ` (${Constants.expoConfig?.ios?.buildNumber})`;
        break;
    }
    return versionStr;
};