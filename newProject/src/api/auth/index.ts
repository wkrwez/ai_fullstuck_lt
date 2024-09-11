import { Socket } from '@/src/api/websocket';
import { logWarn } from '@Utils/error-log';
import { uuid } from '@Utils/uuid';
import { createSocketConnect } from '../websocket/connect';
import { ErrorRes, LogoutReq, Stream } from '../websocket/stream_connect';

// todo 要把websocket中的请求挪过来
export const StreamClient = createSocketConnect('Stream', Stream);
export const StreamLogout = () => {
  const socket = new Socket();
  const msgId = uuid();
  return new Promise((resolve, reject) => {
    socket.send(
      {
        module: 'Stream',
        command: 'Logout',
        body: new LogoutReq({}).toBinary()
      },
      msgId,
      true
    );

    Socket.on(msgId, buff => {
      return resolve({ msgId });
    });

    // 5s还没有响应，直接返回了
    setTimeout(() => {
      resolve({ msgId });
      logWarn(
        'StreamLogout',
        JSON.stringify({
          msgId,
          conid: Socket._connid
        })
      );
    }, 5000);
  });
};
