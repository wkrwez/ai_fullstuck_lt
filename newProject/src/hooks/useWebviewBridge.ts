import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { logWarn } from '../utils/error-log';
import { getVersionStr } from '../utils/getVersion';

const ERROR_MESSAGES: {
  [x: string]: string;
} = {
  PARSE_ERROR:
    'Parse data error, window.ReactNativeWebView.postMessage only accepts one argument which must be a string.',
  CALL_ERROR: 'Call registry method error, method name: ',
  DUPILICATE_FUNCTION_NAME: 'dupilicate function name registerd'
};

const errorPrefix = '[webview bridge]';
Object.keys(ERROR_MESSAGES).forEach(key => {
  ERROR_MESSAGES[key] = `${errorPrefix}${ERROR_MESSAGES[key]}`;
});

const injectedJavaScript = `
    (function() {
      const registry = {};
      window.isNative = true;
      window.nativeOS = '${Platform.OS}';
      window.nativeVersion = '${Platform.Version}';
      window.appName = 'lipu';
      window.appVersion = '${getVersionStr()}'
      window.addWebviewBridgeListener = function(type, fn) {
        if (registry[type]) {
          registry[type].push(fn);
        }
        registry[type] = [fn];
      }

      window.removeWebviewBridgeListener = function(type, fn) {
        const arr = registry[type]
        if (fn && arr) {
          arr.splice(arr.findIndex(cb => fn === cb), 1);
        } else {
          delete registry[type];
        }
      }

      window.webviewBridgeOnMessage = function(message) {
        let data;
        try {
          data = JSON.parse(message);
        } catch (error) {
          console.warn('${ERROR_MESSAGES.PARSE_ERROR}');
        }
        if (data) {
          const {
            type,
            parameter
          } = data;
          try {
            var _registry$type;
            (_registry$type = registry[type]) === null || _registry$type === void 0 ? void 0 : _registry$type.forEach(fn => {
              fn === null || fn === void 0 || fn(parameter);
            });
          } catch (error) {
            console.warn('${ERROR_MESSAGES.CALL_ERROR}' + type);
          }
        }
      };
    })();
    true;
  `;

/**
 *
 * @param webviewRef 传入才可以向webview发送事件，不传只能接收
 * @returns
 */
export const useWebviewBridge = (
  webviewRef: React.MutableRefObject<WebView>
) => {
  const bridgeMethodRegistryRef = useRef<{
    [x: string]: ((arg: unknown) => void)[];
  }>({});

  // let resolve: (value?: unknown) => void | undefined;

  // const webviewReadyPromiseRef = useRef(
  //   new Promise(r => {
  //     resolve = r;
  //   })
  // );

  const onMessage: ConstructorParameters<
    typeof WebView
  >[0]['onMessage'] = event => {
    const bridgeMethodRegistry = bridgeMethodRegistryRef.current;
    let data: undefined | { type: string; parameter: unknown };
    try {
      const str = event.nativeEvent.data;
      data = JSON.parse(str);
    } catch (error) {
      logWarn(ERROR_MESSAGES.PARSE_ERROR, error);
    }
    if (data) {
      const { type, parameter } = data;
      try {
        bridgeMethodRegistry[type]?.forEach(fn => {
          fn?.(parameter);
        });
      } catch (error) {
        logWarn(`${ERROR_MESSAGES.CALL_ERROR}${type}`, error);
      }
    }
  };

  /**
   * @description 注册监听webview触发的事件
   * @param type
   * @param fn 防止同一事件函数签名不一致，监听函数只能接受一个参数
   */
  const addWebviewBridgeListener = (type: string, fn: (arg: any) => void) => {
    const bridgeMethodRegistry = bridgeMethodRegistryRef.current;
    if (bridgeMethodRegistry[type]) {
      bridgeMethodRegistry[type].push(fn);
    }
    bridgeMethodRegistry[type] = [fn];
  };

  const removeWebviewBridgeListener = (
    type: string,
    fn?: (arg: any) => void
  ) => {
    const bridgeMethodRegistry = bridgeMethodRegistryRef.current;
    const arr = bridgeMethodRegistry[type];
    if (fn && arr) {
      arr.splice(
        arr.findIndex(cb => fn === cb),
        1
      );
    } else {
      delete bridgeMethodRegistry[type];
    }
  };

  /**
   * @description 触发webview已内注册的事件，需要使用此hook时传入webviewRef
   * @param type
   * @param parameter
   */
  const triggerWebviewBridgeEvent = (type: string, parameter: unknown) => {
    console.log('### webview ref: ', webviewRef.current.injectJavaScript);
    webviewRef?.current?.injectJavaScript(`
        if (!!window.webviewBridgeOnMessage) {
          window.webviewBridgeOnMessage(${JSON.stringify({ type, parameter })});
        }
      `);
  };

  return {
    onMessage,
    addWebviewBridgeListener,
    removeWebviewBridgeListener,
    injectedJavaScript,
    triggerWebviewBridgeEvent
  };
};
