import {
  AnyMessage,
  Message,
  MethodInfo,
  MethodInfoBiDiStreaming,
  MethodInfoClientStreaming,
  MethodInfoServerStreaming,
  MethodInfoUnary,
  PartialMessage,
  ServiceType
} from '@bufbuild/protobuf';
import { AnyClient, makeAnyClient } from '@connectrpc/connect';
import { Socket } from './index';
import { ErrorRes } from './stream_connect';

type MethodsInfo<I, O> = {
  [localName: string]: <I, O>(req: I) => Promise<O>;
};

export interface SocketCallbacks<O, T = any> {
  onStart?: (params: { msgId: string; method: string }) => void;
  onData?: (params: {
    msgId: string;
    method: string;
    data: O;
    throwError: (error: ErrorRes) => void;
    resolve: (data: T) => void;
  }) => void;
  onError?: (params: {
    msgId: string;
    method: string;
    error: ErrorRes | Uint8Array;
  }) => void;
  throwError?: (error: ErrorRes) => void;
}

// tofo暂时不支持
// export type PromiseClient<T extends ServiceType> = {
//     [P in keyof T["methods"]]: T["methods"][P] extends MethodInfoUnary<infer I, infer O> ? (request: PartialMessage<I>, callbacks?: SocketCallbacks<O>) => Promise<O> : T["methods"][P] extends MethodInfoServerStreaming<infer I, infer O> ? (request: I, callbacks?: SocketCallbacks<O>) => AsyncIterable<O> : T["methods"][P] extends MethodInfoClientStreaming<infer I, infer O> ? (request: AsyncIterable<I>, options?: SocketCallbacks<O>) => Promise<O> : T["methods"][P] extends MethodInfoBiDiStreaming<infer I, infer O> ? (request: AsyncIterable<I>, options?: SocketCallbacks<O>) => AsyncIterable<O> : never;
// };

type PromiseMethod<I, O> = (
  request: I | Promise<I>,
  callbacks?: SocketCallbacks<O>
) => Promise<O>;
export type PromiseClient<T extends ServiceType> = {
  [P in keyof T['methods']]: T['methods'][P] extends MethodInfoUnary<
    infer I,
    infer O
  >
    ? PromiseMethod<PartialMessage<I>, O>
    : T['methods'][P] extends MethodInfoServerStreaming<infer I, infer O>
      ? PromiseMethod<PartialMessage<I>, O>
      : T['methods'][P] extends MethodInfoClientStreaming<infer I, infer O>
        ? PromiseMethod<PartialMessage<I>, O>
        : T['methods'][P] extends MethodInfoBiDiStreaming<infer I, infer O>
          ? PromiseMethod<PartialMessage<I>, O>
          : never;
};

export function createSocketConnect<T extends ServiceType>(
  module: string,
  Service: T
) {
  // const socket = new Socket();

  return makeAnyClient(Service, methodInfo => {
    return createPromiseClient(module, methodInfo);
  }) as PromiseClient<T>;
}

export function createPromiseClient(
  module: string,
  methodInfo: MethodInfo,
  socket?: Socket
) {
  const { I, O } = methodInfo;
  return (payload: typeof I, callbacks?: SocketCallbacks<typeof O>) => {
    const command = methodInfo.name;
    const socket = new Socket();
    const msgId = socket.send({
      module,
      command,
      body: new I(payload).toBinary()
    });

    return new Promise((resolve, reject) => {
      const throwError = (error: ErrorRes) => {
        reject(error);
      };

      Socket?.on(msgId, e => {
        if (!e || e instanceof ErrorRes) {
          const error = new ErrorRes({ code: 1, reason: 'data error' });
          if (callbacks && callbacks.onError) {
            callbacks.onError({ msgId, method: command, error });
          }
          reject(error);
          return;
        }
        const data = O.fromBinary(e);

        if (callbacks && callbacks.onData) {
          callbacks.onData({
            msgId,
            method: command,
            // @ts-ignore
            data,
            throwError,
            resolve
          });
        } else {
          resolve({ ...data, traceid: msgId });
        }
      });

      let rejected = 0;
      Socket?.on(`error:${msgId}`, error => {
        if (callbacks && callbacks.onError) {
          callbacks.onError({ msgId, method: command, error });
        }
        if (!rejected) {
          reject(error);
          rejected = 1;
        }
      });

      // todo 超时逻辑
    });
  };
}
