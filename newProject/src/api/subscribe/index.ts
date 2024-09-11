import { createSocketConnect } from '../websocket/connect';
import { Subscribe } from '@/proto-registry/src/web/raccoon/brandsubscribe/brandsubscribe_connect';

export const SubscribeBrandClient = createSocketConnect('Subscribe', Subscribe);
