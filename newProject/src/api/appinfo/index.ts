import { createSocketConnect } from '../websocket/connect';
import { AppInfo } from '@/proto-registry/src/web/raccoon/appinfo/appinfo_connect';

export const appInfoClient = createSocketConnect('AppInfo', AppInfo);
