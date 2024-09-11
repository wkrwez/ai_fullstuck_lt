import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, TouchableOpacity, View } from 'react-native';
import { TakePhoto } from '@/src/api';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { DetailInfo, useDetailStore } from '@/src/store/detail';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { StyleSheet } from '@/src/utils';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { reportClick } from '@/src/utils/report';
import { Checkbox } from '@Components/checkbox';
import { TakePhotoButton } from '@Components/detail/takePhotoButton';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { SheetModal, SheetModalProps } from '@Components/sheet';
import { Text } from '@Components/text';
import { FadeView } from '../../animation';
import { showToast } from '../../toast';
import { PhotoTask } from '@step.ai/proto-gen/raccoon/makephoto/makephoto_pb';

/** interface */
export interface SameSheetProps extends SheetModalProps {
  data: DetailInfo;
  onTakePhoto: (index: string) => void;
}
/** interface end */

/** components */
interface ImageItemProps {
  url: string;
  checked: boolean;
  onChange: (v: string) => void;
  value: string;
}

function ImageItem(props: ImageItemProps) {
  return (
    <Pressable
      style={imageStyle.$wrap}
      onPress={() => {
        props.onChange(props.value);
      }}
    >
      <Image
        style={StyleSheet.imageFullStyle}
        source={formatTosUrl(props.url, { size: 'size4' })}
      />
      {props.checked && <FadeView style={imageStyle.$mask}></FadeView>}
      <Checkbox
        icon="createChecked"
        size={22}
        style={imageStyle.$checkbox}
        checked={props.checked}
      />
    </Pressable>
  );
}

const imageStyle = StyleSheet.create({
  $wrap: {
    width: 108,
    height: 145,
    borderRadius: 6,
    overflow: 'hidden'
  },
  $checkbox: {
    position: 'absolute',
    top: 6,
    right: 6
  },
  $mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.4)
  }
});
/** components end */

export function SameSheet(props: SameSheetProps) {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const [value, setValue] = useState<string>('');
  const valueRef = useRef<string>('');
  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  return (
    <SheetModal
      title="请选择你想要拍摄的同款"
      maskShown={true}
      maskOpacity={0.4}
      closeBtn={true}
      remainHeight={0}
      //   titleBarStyle={{ display: 'none' }}
      {...props}
    >
      <View style={[st.$wrap]}>
        <View
          style={[StyleSheet.rowStyle, { justifyContent: 'space-between' }]}
        >
          <Text preset="title" style={{ fontSize: 16, fontWeight: '600' }}>
            请选择你想要拍摄的同款
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.onClose();
            }}
          >
            <Icon icon="close" />
          </TouchableOpacity>
        </View>
        <View style={st.$imageList}>
          {props.data.photos.map(item => (
            <ImageItem
              value={item.photoId}
              onChange={v => {
                console.log(111, v);
                setValue(v);
              }}
              checked={value === item.photoId}
              {...item}
              key={item.photoId}
            />
          ))}
        </View>
        <View style={[st.$buttonWrap]}>
          <TakePhotoButton
            style={{
              width: 280,
              height: 44
            }}
            onPress={onPress}
          />
        </View>
      </View>
    </SheetModal>
  );

  function onPress() {
    reportClick('join_button', {
      detailId: props.data.cardId
    });
    if (!valueRef.current) {
      showToast('请选择要拍摄的同款');
      return;
    }

    // const mapData = useDetailStore.getState().detail?.mapProtoData;
    // if (!mapData) return;
    // const data = mapData[valueRef.current];
    // const { protoId, prompt, photos, size, roles, style } = data;

    // useMakePhotoStoreV2.getState().syncData({
    //   prompt,
    //   protoId,
    //   roles,
    //   style,
    //   cardId: useDetailStore.getState().detail?.cardId || ''
    // });
    // useMakePhotoStoreV2.getState().changePageState(PageState.diy);
    // router.push({
    //   pathname: '/make-photo/'
    // });
    props.onTakePhoto(valueRef.current);
    props.onClose();
  }
}

/* style */
const st = StyleSheet.create({
  $wrap: {
    backgroundColor: StyleSheet.currentColors.white,
    padding: StyleSheet.spacing.md,
    paddingBottom: 0,
    borderRadius: 18
  },
  $imageList: {
    ...StyleSheet.rowStyle,
    marginTop: 20,
    gap: 8,
    flexWrap: 'wrap'
  },
  $buttonWrap: {
    ...StyleSheet.rowStyle,
    justifyContent: 'center',
    marginTop: 24
    // marginBottom: 36
  }
});
/* style end */
