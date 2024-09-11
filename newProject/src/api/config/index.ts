import { createSocketConnect } from '../websocket/connect';
import { Resource } from '@/proto-registry/src/web/raccoon/resource/resource_connect';

export const ResourceClient = createSocketConnect('Resource', Resource);
