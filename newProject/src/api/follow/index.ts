import { createSocketConnect } from '../websocket/connect'
import { Follow } from '@/proto-registry/src/web/raccoon/follow/follow_connect';

export const FollowClient = createSocketConnect('Follow', Follow);
