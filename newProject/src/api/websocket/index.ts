import { getCommonHeaders } from '@/src/api/services';
import { useAppStore } from '@/src/store/app';
import { useStorageStore } from '@/src/store/storage';
import { getPageID } from '@/src/utils/report';
import { showToast } from '@Components/toast';
import { CacheEvent } from '@Utils/cacheEvent';
import { logWarn } from '@Utils/error-log';
import { Event } from '@Utils/event';
import { getChannel } from '@Utils/getChannel';
import { log } from '@Utils/logger';
// const Methods = Stream.methods;
import { uuid } from '@Utils/uuid';
import { lipuAPIEnv } from '../env';
import { PointsCode } from '@/proto-registry/src/web/raccoon/errorcode/errorcode_pb';
import * as APM from '@step.ai/apm-module';
import * as InsightTracker from '@step.ai/insight-tracker-module';
import { logInfo } from '@step.ai/logging-module';
import { agreedUponToS, setAgreedUponToS } from '@step.ai/tos-module';
import {
  AuthBindReq,
  AuthBindRes,
  ErrorRes,
  HeartbeatReq,
  Stream,
  StreamMsg
} from './stream_connect';

const cache = new CacheEvent();

export const createWS = async () => {
  const header = await getCommonHeaders();
  const item = lipuAPIEnv.currentAPIEnvItem();
  const ws = new WebSocket(`${item.WS}`);
  // const ws = new WebSocket('wss://lipu-gateway.c.ibasemind.com/wss/connection')

  ws.binaryType = 'arraybuffer';
  return ws;
};

export interface SocketOpts {
  heartbeatTime?: number;
  ignoreCreate?: boolean;
  onAuthErr?: () => void;
  onAuthSucc?: () => void;
}

export interface RequestParams {
  module: string;
  command: string;
  body?: Uint8Array;
}

export interface SocketClient {
  method: string;
  // req: any, // todo
  // res?: any, // todo
  socket: Socket;
}

export enum SocketConnectState {
  initial = 'initial', // 初始未连接
  connecting = 'connecting', // 连接中
  connected = 'connected', // 连接成功
  token = 'token', // 获取token成功，打开中
  auth = 'auth', // 鉴权成功
  disconnect = 'disconnect' // 网络连接失败
}

export enum ErrorCode {
  common = 1,
  auth = 2,
  socket = 3,
  login = -1006
}

export enum WebsocketCloseCode {
  // CloseCodeNormal 正常关闭
  CloseCodeNormal = 1000,
  // 客户端主动断连
  CloseCodeErrorClient = 1001,
  // 客户端主动断连
  CloseCodeClient = 1006,
  // CloseCodeAuthFailed 鉴权失败
  CloseCodeAuthFailed = 4001,
  //CloseCodeAuthTimeout 鉴权超时失败
  CloseCodeAuthTimeout = 4002,
  //CloseCodeHeartbeatTimeout 心跳超时失败
  CloseCodeHeartbeatTimeout = 4003,
  // CloseCodeSameUserReconnect 同用户连接冲突
  CloseCodeSameUserReconnect = 4004,
  // CloseCodeKickOut 踢下线
  CloseCodeKickOut = 4005,
  // CloseCodeUserForbidden 用户封禁
  CloseCodeUserForbidden = 4006,
  // CloseCodeParseMsgFailed 解析数据失败
  CloseCodeParseMsgFailed = 4007,
  // CloseCodeServerRestart 服务重启
  CloseCodeServerRestart = 4008
}

const RECONNECT_CODES = [
  WebsocketCloseCode.CloseCodeNormal,
  WebsocketCloseCode.CloseCodeErrorClient,
  WebsocketCloseCode.CloseCodeClient,
  // WebsocketCloseCode.CloseCodeAuthTimeout,
  WebsocketCloseCode.CloseCodeHeartbeatTimeout,
  WebsocketCloseCode.CloseCodeParseMsgFailed,
  WebsocketCloseCode.CloseCodeServerRestart
];
export enum AuthState { // 鉴权状态
  initial = 'initial',
  anonymous = 'anonymous',
  user = 'user'
}
interface QueueData {
  msgId: string;
  data: RequestParams;
}

export enum AsyncEventType {
  getToken = 'getToken'
}

const RETRY_MAX = 3;
const CONNECT_RETRY_MAX = 7;
export class Socket {
  static _conn: null | WebSocket = null;
  // static isConnected = false
  // static _connecting = 0
  static _state = SocketConnectState.initial; // 当前的连接状态
  static _authState = AuthState.initial; // 当前的连接状态
  static _sendQueue: QueueData[] = [];
  static _connid: string | null = null;
  static _retryAuthTime: 0; // 鉴权重试次数
  static _retryConnenctTime: 0; // 重连重试次数
  static _heartHandler: any = null; // todo

  static events: Event = new Event();

  static auth: AuthBindReq | null = null;

  static lastRafTime = 0;

  static _requestTasks = new Set();

  HeartbeatTime = 30 * 1000;

  onAuthErr?: () => void;
  onAuthSucc?: () => void;

  constructor(options?: SocketOpts) {
    this.HeartbeatTime = options?.heartbeatTime || this.HeartbeatTime;
    this.onAuthErr = options?.onAuthErr;
    this.onAuthSucc = options?.onAuthSucc;
    if (!options?.ignoreCreate) {
      this.create();
    }
  }
  async create() {
    // 没同意不请求
    if (!agreedUponToS()) {
      return;
    }

    if (Socket._state !== SocketConnectState.initial && Socket._conn) {
      return Socket._conn;
    }
    Socket._state = SocketConnectState.connecting; // 将状态变更为连接中
    const item = lipuAPIEnv.currentAPIEnvItem();

    console.log('[new websocket]');
    const conn = new WebSocket(`${item.WS}`);
    conn.binaryType = 'arraybuffer';

    Socket._conn = conn;

    this.initAuth();
    this.addConnEvents();
    Socket._state = SocketConnectState.connecting;
    return conn;
  }

  initAuth() {
    // if (Socket.auth) {
    //   // 已有鉴权信息 不重复鉴权
    //   cache.complete(AsyncEventType.getToken);
    //   return;
    // }
    // 获取鉴权信息
    getCommonHeaders()
      .then(commonHeaders => {
        console.log('commonHeaders----------', commonHeaders);
        const device = commonHeaders['oasis-device-brand'];
        useStorageStore.getState().__setStorage({ device });
        Socket.auth = new AuthBindReq({
          product: 'aigc',
          token: commonHeaders['Oasis-Token'],
          // token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmF0ZWQiOnRydWUsImFnZSI6MSwiYmFuZWQiOmZhbHNlLCJjcmVhdGVfYXQiOjE3MTYzNTc4MDMsImV4cCI6MTc0Nzg5MzgwMywibW9kZSI6Miwib2FzaXNfaWQiOjEyMzQ1LCJ2ZXJzaW9uIjoyfQ.Hu3F9c2kHORavodPbInzr_YPUMLIJ3rXHHmIoezwdd4...eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOjEwNDAwLCJkZXZpY2VfaWQiOiJEZXZNb2NrRGlkLTEyMyIsImV4cCI6MTc0Nzg5MzgwMywib2FzaXNfaWQiOjEyMzQ1LCJwbGF0Zm9ybSI6IndlYiIsInZlcnNpb24iOjJ9.OBQhUZo61nVkzprqcAHvSyCaNHvj6aOediWvlwD0EPw',
          // uid: '123', // TODO: 先把uid写死，不影响测试
          tokenType: '1', // TODO: 鉴权方式
          platform: commonHeaders['Oasis-platform'] === 'ios' ? 4 : 3, // // 0=所有版本, 1=Web H5, 2=小程序, 3=Android, 4=iPhone
          device: commonHeaders['oasis-device-brand'],
          appVersion: commonHeaders['oasis-app-version'],
          channel: getChannel() || commonHeaders['oasis-channel'],
          did: commonHeaders['Oasis-Did']
        });

        cache.complete(AsyncEventType.getToken);
      })
      .catch((e: any) => {
        log.info('[auth token error]', e);
        logWarn('auth token error', {
          error: e
        });
        lipuAPIEnv.cleanUp();
        if (!Socket._retryAuthTime) Socket._retryAuthTime = 0;
        if (Socket._retryAuthTime > RETRY_MAX) {
          // showToast('登录失败，请退出app重试~');
          return;
        } else {
          Socket._retryAuthTime += 1;
          this.initAuth();
        }
      });
  }

  onError(err: ErrorRes) {
    // 统一错误处理
    // this.disconnect()
    // if (err.code === ErrorCode.socket) {
    //   log.info('[socket event onerror]', err, Socket._connid);
    //   logWarn('socket event onerror', { err, connid: Socket._connid });
    //   this.reconnect();
    //   return;
    // }
    Socket._state = SocketConnectState.initial;
    if (err.code === ErrorCode.auth && this.onAuthErr) {
      // 鉴权失败回调
      Socket._authState = AuthState.initial;
      Socket.auth = null;
      this.onAuthErr();
    } else if (err.code === ErrorCode.common) {
      // this.disconnect();
      // this.create();
      logWarn('reconnect', { err, connid: Socket._connid });
      this.reconnect();
    } else if (err.code === ErrorCode.login) {
      // 匿名态
      // todo showLogin()
      Socket._authState === AuthState.anonymous;
      // Socket.auth = null;
    }
    logWarn('socket onerror', JSON.stringify({ err, connid: Socket._connid }));
  }

  static getAuthState() {
    return Socket._authState;
  }

  static getAuthedState() {
    return Socket._authState !== AuthState.initial;
  }
  static getUserAuthState() {
    log.info('getUserAuthState', Socket._authState);
    return Socket._authState === AuthState.user;
  }

  static clearAuth() {
    Socket._authState = AuthState.initial;
    Socket.auth = null;
  }

  startHeartbeat() {
    if (Socket._heartHandler) {
      clearTimeout(Socket._heartHandler);
      Socket._heartHandler = null;
    }
    this.heartbeat();
    Socket._heartHandler = setTimeout(() => {
      this.startHeartbeat();
    }, this.HeartbeatTime);
  }

  addConnEvents() {
    const { _conn } = Socket;
    if (!_conn) return;

    if (_conn.onmessage) return;

    log.info('addConnEvents', Socket._state);
    // if (Socket._state !== SocketConnectState.initial) {
    //     // alert(12243434)
    //     return
    // }
    _conn.onopen = () => {
      log.info(
        'readyState-----',
        _conn.readyState,
        'CONNECTING',
        WebSocket.CONNECTING,
        'OPEN',
        WebSocket.OPEN
      );
      log.info('open------');
      Socket.events.emit('open');
      Socket._state = SocketConnectState.connected;
      cache.do(() => {
        Socket._state = SocketConnectState.token; // 保证状态变化的线性，所以在connected后再变更状态至token
        this.sendAuth();
      }, [AsyncEventType.getToken]);
    };

    _conn.onmessage = event => {
      if (event.data instanceof ArrayBuffer) {
        const uint8Array = new Uint8Array(event.data);
        const { body, head } = StreamMsg.fromBinary(uint8Array);
        logInfo('[onmessage]', JSON.stringify(head));
        Socket.events.emit('message', body);

        if (head?.msgType === 4 || !body) {
          // todo 要定义枚举值
          const error = body
            ? ErrorRes.fromBinary(body)
            : { code: 1, reason: '回包异常' };
          log.info('[websocket error]', error, body, head, Socket._connid);
          logWarn('socket msgType error', {
            error,
            connid: Socket._connid,
            msgId: head?.msgId,
            module: head?.module,
            command: head?.command
          });
          Socket.events.emit(`error:${head?.msgId}`, error);
          Socket.events.emit(`error:${head?.module}/${head?.command}`, error);
          Socket.events.emit(`error`, error);
          if (error.code === ErrorCode.login) {
            this.onError(
              new ErrorRes({ code: ErrorCode.login, reason: 'login required' })
            );
          }

          return;
        }

        if (head?.msgId) {
          Socket.events.emit(head?.msgId, body);
          Socket._requestTasks.delete(head?.msgId);
        }
        if (head?.command && head?.module) {
          Socket.events.emit(`${head.module}/${head.command}`, body);
        }

        // log.info('onmessage', decodeStreamMsg(uint8Array));
      }
    };

    _conn.onerror = e => {
      // alert(3245252);
    };
    _conn.onclose = e => {
      // 给没完成的请求发错误通知
      // console.log('[_requestTasks info]', Socket._requestTasks.entries());
      Socket._requestTasks.forEach(v => {
        Socket.events.emit(
          `error:${v}`,
          new ErrorRes({
            code: 1,
            reason: 'network error'
          })
        );
      });
      Socket._requestTasks = new Set();

      // 正常关闭
      if (Socket._retryConnenctTime > CONNECT_RETRY_MAX) {
        // 重试10次失败忽视
        return;
      }

      Socket._retryConnenctTime += 1;
      Socket.events.emit('disconnect', e);
      log.warn('websocket onclose', e, e.code, Socket._connid);
      logWarn('socket onerror event', e, 'Socket', false, {
        connid: Socket._connid || 'null'
      });

      //  || !e.code
      if (RECONNECT_CODES.includes(e.code)) {
        Socket.events.emit('close', e);
        this.reconnect();
      }

      // 鉴权失败
      if (
        e.code === WebsocketCloseCode.CloseCodeAuthFailed ||
        e.code === WebsocketCloseCode.CloseCodeAuthTimeout ||
        e.code === WebsocketCloseCode.CloseCodeKickOut
      ) {
        Socket.clearAuth();
        this.reconnect();
      }

      if (
        e.code === WebsocketCloseCode.CloseCodeKickOut ||
        e.code === WebsocketCloseCode.CloseCodeUserForbidden
      ) {
        useAppStore.getState().logout();
      }
    };
  }

  // 发鉴权包
  sendAuth(oMsgId?: string) {
    const msgId = oMsgId || uuid();
    log.info('sendAuth------', Socket.auth, msgId);

    return new Promise((resolve, reject) => {
      if (!Socket.auth) {
        this.onError(
          new ErrorRes({ code: ErrorCode.auth, reason: '没有鉴权信息' })
        );

        log.info('[error]没有鉴权信息');
        return msgId;
      }

      logInfo('[request sendAuth------]', msgId);
      this.send(
        {
          module: 'Stream',
          command: 'Auth',
          body: new AuthBindReq(Socket.auth).toBinary()
        },
        msgId,
        true
      );

      Socket.on(msgId, buff => {
        if (buff instanceof ErrorRes) {
          const err = new ErrorRes({
            code: ErrorCode.auth,
            reason: 'auth error'
          });
          console.log('[auth err]', buff);
          this.onError(err);
          reject(err);
          return msgId;
        } else {
          const data = AuthBindRes.fromBinary(buff);
          log.info('[auth info]', data);
          InsightTracker.updateUserUniqueID(data?.uid.toString() || null);
          APM.updateUID(data?.uid.toString()).catch(() => {});
          Socket._connid = data.conn || null;
          if (data?.code) {
            const err = new ErrorRes({
              code: ErrorCode.auth,
              reason: 'auth error'
            });
            this.onError(
              new ErrorRes({
                code: ErrorCode.auth,
                reason: `auth error${JSON.stringify(data)}`
              })
            );
            reject(err);
            return msgId;
          }

          Socket._state = SocketConnectState.auth;
          Socket._authState = data.logined
            ? AuthState.user
            : AuthState.anonymous;
          this.startHeartbeat(); // 鉴权成功才开始发心跳包
          Socket._sendQueue.forEach(({ msgId, data }) => {
            this.send(data, msgId);
          });
          Socket._sendQueue = [];
          Socket.events.emit('connected', { logined: data.logined });
          if (this.onAuthSucc) {
            this.onAuthSucc();
          }
          resolve(Socket._authState);
        }
      });
    });
  }

  // 发心跳包
  heartbeat(oMsgId?: string | undefined) {
    // todo 监听下心跳无回包
    log.info('heartbeat---------', Socket._connid);
    const msgId = oMsgId || uuid();
    this.send(
      {
        module: 'Stream',
        command: 'Heartbeat',
        body: new HeartbeatReq({}).toBinary()
      },
      msgId
    );
    let isReceivedHearbeat = 0;
    Socket.on(msgId, buff => {
      log.info('received heartbeat---------', Socket._connid);
      isReceivedHearbeat = 1;
      // log.info('heartbeat', buff)
    });
    // todo 心跳超时检测
    // setTimeout(())
    return msgId;
  }

  // 发普通包
  send(
    params: RequestParams,
    oMsgId?: string | undefined,
    isAuthPackect?: boolean
  ) {
    console.log('readyState', Socket._conn?.readyState);
    const msgId = oMsgId || uuid();
    const { body: _, ...rest } = params;
    // logInfo(
    //   '[send]',
    //   [
    //     msgId,
    //     !!Socket._conn,
    //     Socket._authState,
    //     isAuthPackect,
    //     Socket._state,
    //     JSON.stringify(rest)
    //   ].join(' ')
    // );
    // 重连 只在send的时候做

    if (params.command !== 'Heartbeat') {
      Socket._requestTasks.add(msgId);
    }
    if (Socket._retryConnenctTime >= CONNECT_RETRY_MAX) {
      this.disconnect();
    }
    Socket._retryConnenctTime = 0; // 重置重连次数
    if (
      !Socket._conn ||
      Socket._state === SocketConnectState.initial ||
      Socket._conn?.readyState !== WebSocket.OPEN
    ) {
      if (!isAuthPackect) {
        // 非鉴权包才入请求队列
        Socket._sendQueue.push({
          msgId,
          data: params
        });
      }

      this.create();
      console.log('触发重连---------');
      // this.reconnect();
      return msgId;
    }

    if (!isAuthPackect && Socket._state !== SocketConnectState.auth) {
      Socket._sendQueue.push({
        msgId,
        data: params
      });
      return msgId;
    }

    const { module, command, body } = params;

    if (!body) {
      log.info('[socket]', 'body缺失');
      return msgId;
    }

    const data = {
      head: {
        frameType: 1, // 包体数据类型，0=text, 1=pb
        msgType: 0, // 0=上行req，1=上行req的回包rsp，2=下行的push，3=下行push的回包（ack）
        msgId: msgId,
        module,
        command
      },
      body
    };
    logInfo(
      '[request]',
      JSON.stringify({
        command,
        module,
        connid: Socket._connid,
        msgId
      })
    );

    // Socket._requestTasks.add(`${module}/${command}`);
    try {
      Socket._conn.send(new StreamMsg(data).toBinary());
    } catch (e) {
      // log.warn('[websocket send error]', e);
      logWarn('socket send error', e);
      // this.onError(new ErrorRes({ code: ErrorCode.common, reason: 'websocket send error' }))
      // this.disconnect() // todo 不断链接会不会有问题
      if (!isAuthPackect) {
        // 非鉴权包才加入请求队列
        Socket._sendQueue.push({
          msgId,
          data: params
        });
      }
      this.create();
    }
    return msgId;
  }

  disconnect() {
    // this.create()
    if (!Socket._conn || Socket._state === SocketConnectState.initial) return;
    log.info('disconnect');

    if (Socket._conn?.readyState !== WebSocket.CLOSED) {
      try {
        Socket._conn.onclose = e => {
          console.log('拦截主动断连的close事件', e);
        };
        Socket._conn.close();
      } catch (e) {}
    }
    this.clearConnection();
  }

  reconnect() {
    this.disconnect();
    this.create();
  }

  clearConnection() {
    Socket._conn = null;
    Socket._connid = null;
    Socket.events.off('close');
    Socket.events.off('open');
    Socket.events.off('disconnect');
    Socket.events.off('message');
  }

  static on(key: string, fn: (args: Uint8Array | ErrorRes) => void) {
    Socket.events.on(key, fn);
  }
  close(key: string) {
    Socket.events && Socket.events.off(key);
  }
  static emit(key: string, args?: object) {
    Socket.events.emit(key, args);
  }
}
