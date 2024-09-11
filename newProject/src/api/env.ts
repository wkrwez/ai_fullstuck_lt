import { storage } from '../store/persistent';
import { APIEnv, APIEnvController } from '@step.ai/connect-api-common';

export const STEPC_API_ENV: APIEnv = {
  PROD: {
    API: 'https://api.lipuhome.com',
    WS: 'wss://ws.lipuhome.com/wss/connection'
  },
  STAGING: {
    API: 'https://lipu.c.ibasemind.com',
    WS: 'wss://lipu.c.ibasemind.com/wss/connection'
  },
  SIT: {
    API: 'https://lipu.c.ibasemind.com',
    WS: 'wss://lipu.c.ibasemind.com/wss/connection'
  },
  DEV: {
    API: 'https://lipu-dev.c.ibasemind.com',
    WS: 'wss://lipu-dev.c.ibasemind.com/wss/connection'
  }
};

export const lipuAPIEnv = new APIEnvController(STEPC_API_ENV, storage, 'SIT');
