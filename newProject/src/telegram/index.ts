import { logWarn } from '@Utils/error-log';

export default class TBridge {
  webviewRef: any;
  onMessageFromWeb: any;

  constructor(webviewRef: any) {
    this.webviewRef = webviewRef;
  }

  sendMessageToWeb(message: any) {
    if (this.webviewRef && this.webviewRef.current) {
      console.log(this.webviewRef.current, 'this.webviewRef.current');
      this.webviewRef.current.injectJavaScript(
        `
        if (!!window.onMessageFromApp) {
         window.onMessageFromApp(${JSON.stringify(message)});
        }
        `
      );
    }
  }

  receiveMessageFromWeb(event: { nativeEvent: { data: any } }) {
    const { data } = event.nativeEvent;
    try {
      const message = JSON.parse(data);
      // TODO: android 这里也失效了 onMessageFromWeb为空？奇怪 [改为 onmessage 里处理]
      this.onMessageFromWeb && this.onMessageFromWeb(message);
    } catch (error) {
      logWarn('Failed to parse message from web:', error);
    }
  }

  setOnMessageFromWeb(callback: any) {
    this.onMessageFromWeb = callback;
  }
}

export const injectMethods = `
    window.onMessageFromApp = function(message) {
        window.LIPU_APP_MSG = message;
    };
    window.sendMessageToApp = function(message) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    };
  `;
