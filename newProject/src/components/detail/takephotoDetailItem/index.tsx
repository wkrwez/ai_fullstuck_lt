import { router } from 'expo-router';
import { ImageStyle, StyleProp, View, ViewStyle } from 'react-native';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks/useAuthState';
import { type ProtoInfo, useDetailStore } from '@/src/store/detail';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { StyleSheet } from '@/src/utils';
import { Source, reportClick } from '@/src/utils/report';
import { Button } from '@Components/button';
import { Collapse } from '@Components/collapse';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { PreviewImage } from '@Components/previewImage';
import { Role } from '@Components/role';
import { Text } from '@Components/text';
import { dp2px } from '@Utils/dp2px';
import { TakePhotoButton } from '../takePhotoButton';

/** constant */
const AND_ICON_URL = require('@Assets/image/detail/and.png');
/** constant end */

/** interface */
interface TakePhotoDetailItemProps {
  detailId: string;
  data?: ProtoInfo;
  onPress?: () => void;
  height?: number;
  style?: StyleProp<ViewStyle>;
}
/** interface end */

/** components */
const iconStyle = StyleSheet.create({
  $wrap: {
    marginTop: 19,
    marginLeft: 3,
    marginRight: 3,
    width: 16,
    height: 16
  }
});
function IconAnd() {
  return (
    <View style={iconStyle.$wrap}>
      <Image style={StyleSheet.imageFullStyle} source={AND_ICON_URL} />
    </View>
  );
}

const buttonHeight = {
  defaultHeight: 30
};

const buttonStyle = StyleSheet.create({
  $wrap: {
    ...StyleSheet.rowStyle,
    backgroundColor: '#FFE5DC',
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: '#FFD8CB',
    fontSize: 0,
    paddingLeft: 16,
    paddingRight: 16
  },
  $text: {
    color: StyleSheet.currentColors.brand1,
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 30,
    height: 30
  }
});
function TakePhotoButtonGo(props: TakePhotoDetailItemProps) {
  const { loginIntercept } = useAuthState();

  if (!props.data) return;
  return (
    <Button
      style={[
        buttonStyle.$wrap,
        props.height ? { height: props.height } : { height: 30 }
      ]}
      onPress={() => onPress(false)}
    >
      <Icon icon="takephoto_primary" />
      <Text style={buttonStyle.$text}>
        {props.data.roles.length === 1 ? '去拍Ta' : '去拍Ta们'}
      </Text>
    </Button>
  );

  function onPress(usePrompt: boolean) {
    return loginIntercept(
      () => {
        if (!props.data) return;
        if (props.onPress) {
          props.onPress();
        }

        reportClick('join_button', {
          detailId: props.detailId
        });

        const { roles, style, prompt, photos } = props.data;
        const cardId = props.detailId;
        const protoId = props.data.protoId;
        useMakePhotoStoreV2.getState().syncData({
          roles,
          ...(usePrompt
            ? {
                prompt,
                style,
                cardId,
                protoId
              }
            : {})
        });
        useMakePhotoStoreV2.getState().changePageState(PageState.diy);
        router.push({
          pathname: '/make-photo/',
          params: {
            from: Source.DRAWING_WITH_CHARACTER
          }
        });
      },
      { scene: LOGIN_SCENE.TAKE_SAME_STYLE }
    );
  }
}

const headerStyle = StyleSheet.create({
  $wrap: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%'
  },
  $buttonWrap: {
    marginTop: 13
  }
});
function ItemHeader(props: TakePhotoDetailItemProps) {
  return (
    <View style={[StyleSheet.rowStyle, headerStyle.$wrap]}>
      <View style={[StyleSheet.rowStyle, { alignItems: 'flex-start' }]}>
        {props.data?.roles.map((item, index) => {
          if (index === (props.data?.roles.length || 0) - 1) {
            return <Role id={item.role} key={item.role} size={54} />;
          }
          return (
            <>
              <Role id={item.role} key={item.role} />
              <IconAnd key={item.role + 'and'} />
            </>
          );
        })}
      </View>
      <View style={headerStyle.$buttonWrap}>
        <TakePhotoButtonGo {...props} />
      </View>
    </View>
  );
}

const IMAGE_SIZE = 94;
const IMAGE_GAP = 9;
const bodyStyle = StyleSheet.create({
  $wrap: {
    ...StyleSheet.rowStyle,
    gap: IMAGE_GAP,
    flexWrap: 'wrap',
    paddingTop: IMAGE_GAP
  },
  $imageItem: {
    width: 71,
    height: IMAGE_SIZE,
    borderRadius: 6,
    overflow: 'hidden'
  }
});
function ItemBody(props: TakePhotoDetailItemProps) {
  const { detailId } = props;

  const { detail } = useDetailStore().getDetail(detailId) || {};
  const { loginIntercept } = useAuthState();

  return (
    <View style={bodyStyle.$wrap}>
      {props.data?.photos?.map((item, index) => {
        return (
          <View key={item.photoId} style={bodyStyle.$imageItem}>
            <PreviewImage
              style={StyleSheet.imageFullStyle}
              source={item.url}
              index={index}
              list={props.data?.photos || []}
              reportParams={{
                contentid: detailId || ''
              }}
              removeMark={detail?.cardMetaAttrs?.['sharable'] === 'false'}
              renderBottomLeftSlot={(item, cb) => {
                return (
                  <TakePhotoButton
                    key="h4"
                    onPress={() => {
                      loginIntercept(
                        () => {
                          if (!props.data) return;
                          const cardId = detail?.cardId;
                          // console.log(123445, protoId);
                          props.onPress?.();
                          reportClick('join_button', {
                            detailId: cardId
                          });

                          const { roles, style, prompt, protoId } = props.data;
                          useMakePhotoStoreV2.getState().syncData({
                            prompt,
                            protoId,
                            roles,
                            style,
                            cardId: detail?.cardId || ''
                          });
                          useMakePhotoStoreV2
                            .getState()
                            .changePageState(PageState.diy);

                          router.push({
                            pathname: '/make-photo/',
                            params: {
                              from: Source.DRAWING_WITH_PROMPT
                            }
                          });
                          cb.close?.();
                        },
                        { scene: LOGIN_SCENE.TAKE_SAME_STYLE }
                      );
                    }}
                  />
                );
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
/** components end */

export function TakePhotoDetailItem(props: TakePhotoDetailItemProps) {
  return (
    <Collapse
      header={<ItemHeader {...props} />}
      body={<ItemBody {...props} />}
      title="图集"
      style={props.style}
      colBtnSyle={{
        bottom: 0
      }}
      expandHeight={dp2px(
        (IMAGE_SIZE + IMAGE_GAP) *
          Math.ceil((props.data?.photos?.length || 0) / 4)
      )}
    ></Collapse>
  );
}

/** style */

/** style end */
