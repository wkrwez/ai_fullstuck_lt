import { SocketCallbacks } from './connect';

type StreamFuncs<I, O> = {
  start: (cb?: SocketCallbacks<O>['onStart']) => StreamFuncs<I, O>;
  on: (cb?: SocketCallbacks<O>['onData']) => StreamFuncs<I, O>;
  do: () => Promise<O>;
  error: (cb?: SocketCallbacks<O>['onError']) => StreamFuncs<I, O>;
};
export const stream = <I, O>(
  method: (req: I, callbacks?: SocketCallbacks<O>) => Promise<O>,
  payload: I
): StreamFuncs<I, O> => {
  // const createRequest = () => { }
  // const request = method(payload, {

  // })
  const callbacks: SocketCallbacks<O> = {};

  return {
    start(cb) {
      callbacks.onStart = cb;
      return this;
    },
    on(cb: SocketCallbacks<O>['onData']) {
      callbacks.onData = cb;
      return this;
    },
    do() {
      return method(payload, callbacks);
    },
    error(cb: SocketCallbacks<O>['onError']) {
      callbacks.onError = cb;
      return this;
    }
  };
};
