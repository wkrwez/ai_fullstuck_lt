import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { WEBVIEW_EVENTS } from '@/src/constants';
import { useAuthState } from '@/src/hooks/useAuthState';
import { useWebviewBridge } from '@/src/hooks/useWebviewBridge';
import { Source } from '@/src/utils/report';
import { Screen } from '@Components/screen';
import { Webview } from '@Components/webview';
import { onTakePhoto } from './make-photo/onTakePhoto';
import { Pressable } from 'react-native';
import { ShareIcon } from '@/assets/image/svg';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { showShare } from '@/src/components/share';
import { ShareImageType, ShareTemplateName } from '@/src/types';
import { ShareCompPreset } from '@/src/components/share/typings';

export default function WebviewScreen() {
  // const setForceSplashHide  = useAppStore((state) => state.setForceSplashHide);

  // useEffect(() => {
  //   setForceSplashHide(true);
  //   return () => {
  //     setForceSplashHide(false);
  //   };
  // }, []);

  const { url = '', title = '', shareParams, searchParams } = useLocalSearchParams<{
    url: string;
    title: string;
    shareParams?: string;
    searchParams?: string;
  }>();

  const [showTitle, setShowTitle] = useState(title);
  const [shareData, setShareDta] = useState(shareParams);

  const webviewRef: React.MutableRefObject<unknown> = useRef(null);
  const {
    injectedJavaScript,
    onMessage,
    addWebviewBridgeListener,
    removeWebviewBridgeListener
  } = useWebviewBridge(webviewRef as React.MutableRefObject<WebView>);

  const { loginIntercept } = useAuthState();

  useEffect(() => {
    addWebviewBridgeListener(WEBVIEW_EVENTS.LOGIN, (arg?: any) => {
      // console.log('### message from web: ', arg);
      loginIntercept(() => {}, arg);
    });
    addWebviewBridgeListener(WEBVIEW_EVENTS.TAKE_PHOTO, arg => {
      // console.log('### message from web: ', arg);
      const { photoId, source, keyword } = arg || {};
      const keywordInString =
        typeof keyword === 'object' ? keyword?.join?.(',') : '';
      loginIntercept(() => {
        onTakePhoto({
          photoId,
          source: source || Source.DRAWING_WITH_PROMPT,
          keyword: keywordInString
        });
      }, arg);
    });
    addWebviewBridgeListener(WEBVIEW_EVENTS.ROUTER_PUSH, arg => {
      // todo: 某些页面需要登录，前置校验
      const { pathname, params } = arg || {};
      if (pathname) {
        router.push({
          pathname,
          params
        });
      }
    });
    addWebviewBridgeListener(WEBVIEW_EVENTS.ROUTER_REPLACE, arg => {
      // todo: 某些页面需要登录，前置校验
      const { pathname, params } = arg || {};
      if (pathname) {
        router.replace({
          pathname,
          params
        });
      }
    });
    addWebviewBridgeListener(WEBVIEW_EVENTS.SHARE_INFO_REGISTER, arg => {
      const { shareParams: sharePayload } = arg || {};
      if (sharePayload) {
        setShareDta(sharePayload)
      }
    });
    addWebviewBridgeListener(WEBVIEW_EVENTS.WEBVIEW_INFO, arg => {
      const { title: webviewTitle } = arg || {};
      if (webviewTitle) {
        setShowTitle(webviewTitle)
      }
    });
    addWebviewBridgeListener(WEBVIEW_EVENTS.ROUTER_BACK, arg => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/feed/');
      }
    });
  }, []);

  const headerRight = () => {
    let shareInfo: any = shareData;
    if (typeof shareData === 'string') {
      try {
        shareInfo = JSON.parse(shareData)
      } catch {
        shareInfo = ''
      }
    }
    if (!shareInfo) return null;

    const handleShare = () => {
      showShare({
        shareInfo: shareInfo,
        allowShareImage: false,
        type: ShareImageType.common,
        theme: Theme.LIGHT,
        shareTemplateName: ShareTemplateName.detail,
        channelPreset: ShareCompPreset.CONTENT_ACTIVITY
      });
    }

    return (
      <Pressable onPress={handleShare}>
        <ShareIcon
          color={getThemeColor(Theme.LIGHT).fontColor}
          width={24}
          height={24}
        />
      </Pressable>
    )
  }

  const linkUrl = useMemo(() => {
    let result = url;
    if (searchParams) {
      result = url + '?' + decodeURIComponent(searchParams);
    }
    return result;
  }, [url, searchParams])

  return (
    <Screen
      title={showTitle}
      titleStyle={{ flexBasis: 280 }}
      headerRight={headerRight}
    >
      <Webview
        url={linkUrl}
        ref={webviewRef}
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
      />
    </Screen>
  );
}
