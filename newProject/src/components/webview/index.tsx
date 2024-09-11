import { FC, LegacyRef, Ref, forwardRef, useEffect, useState } from 'react';
import { Dimensions, StyleProp, View, ViewStyle } from 'react-native';
import * as Progress from 'react-native-progress';
import { WebView, type WebViewProps } from 'react-native-webview';
import { DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { colorsUI } from '@/src/theme';
import { SheetModal } from '@Components/sheet/SheetModal';
import { SheetModalProps } from '@Components/sheet/type';
import { Icon, IconClose } from '../icons';
import { getVersionStr } from '@/src/utils/getVersion';

// import { SheetModal, SheetModalProps } from '@Components/index';

const screenHeight = Dimensions.get('window').height;

export interface IWebviewProps extends WebViewProps {
  containerStyle?: StyleProp<ViewStyle>;
  url: string;
  ref?: any;
}
export const Webview: FC<IWebviewProps> = forwardRef((props, ref) => {
  const { containerStyle, url, ...resetProps } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<number>(0.1);

  const versionStr = getVersionStr();
  return (
    <View
      style={[
        {
          flex: 1
        },
        containerStyle
      ]}
    >
      <WebView
        ref={ref as LegacyRef<any>}
        source={{ uri: url }}
        applicationNameForUserAgent={`lipuapp/${versionStr}`}
        onLoadProgress={({ nativeEvent: { progress } }) => {
          if (progress === 1) setIsLoading(false);
          setProgress(progress);
        }}
        {...resetProps}
      />
      {!!isLoading && (
        <Progress.Bar
          borderWidth={0}
          progress={progress}
          width={null}
          style={{
            height: 2,
            borderRadius: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: colorsUI.Background.brand.default
          }}
        ></Progress.Bar>
      )}
    </View>
  );
});

export type PreviewProps = {
  url: string;
  title: string;
  zIndex?: number;
};

export const WebviewSingleton = {
  preview: (props: PreviewProps) => {
    console.log(props);
  }
};
export const webviewPreview = (params: PreviewProps) =>
  WebviewSingleton.preview(params);

export type WebViewModalProps = SheetModalProps & {
  url: string;
};

export const WebviewModal = ({ url, ...reset }: WebViewModalProps) => {
  return (
    <SheetModal {...reset} dragable childrenPadding={false}>
      <Webview
        containerStyle={{
          height: screenHeight * 0.7,
          backgroundColor: 'transparent'
        }}
        url={url}
      />
    </SheetModal>
  );
};

export const WebviewGlobal = () => {
  const [visible, setVisible] = useState(false);
  const [urlState, setUrlState] = useState('');
  const [title, setTitle] = useState('');
  const [zIndex, setZIndex] = useState(DEFAULT_SHEET_ZINDEX + 1);

  useEffect(() => {
    const registerPreview = () => {
      WebviewSingleton.preview = ({ url, title, zIndex }) => {
        if (url) {
          setVisible(true);
          setUrlState(url);
          setTitle(title);
          zIndex && setZIndex(zIndex);
        }
      };
    };
    registerPreview();
  }, []);
  return (
    <SheetModal
      isVisible={visible}
      dragable={false}
      maskShown={true}
      maskOpacity={0.4}
      remainHeight={0}
      maskClosable={true}
      title={title}
      onClose={() => {
        setVisible(false);
      }}
      childrenPadding={false}
      zIndex={zIndex}
    >
      {urlState && (
        <Webview
          containerStyle={{
            height: screenHeight * 0.7,
            backgroundColor: 'transparent'
          }}
          url={urlState}
        ></Webview>
      )}
    </SheetModal>
  );
};
