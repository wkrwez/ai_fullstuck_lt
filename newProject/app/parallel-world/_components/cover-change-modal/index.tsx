import { useState } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Icon, Image, SheetModal } from '@/src/components';
import { selectState } from '@/src/store/_utils';
import { useParallelWorldConsumerStore } from '@/src/store/parallel-world-consumer';
import { useParallelWorldPublishStore } from '@/src/store/parallel-world-publish';
import { colors } from '@/src/theme';
import { $flexHCenter } from '@/src/theme/variable';
import { StyleSheet } from '@Utils/StyleSheet';
import { parallelWorldColors } from '../../_constants';
import ImgGenGallery from '../img-gen-gallery';
import ImageLoading from '../loading/image-loading';
import AiPressableInput from '../others/ai-pressable-input';
import ParallelWorldButton from '../others/parallel-world-button';
import Radio from '../others/radio';
import { ActImage } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { useShallow } from 'zustand/react/shallow';

const CoverChangeModal = () => {
  const { isChangeCoverModalVisible, closeChangeCoverModal, changeCoverImg } =
    useParallelWorldPublishStore(
      useShallow(state =>
        selectState(state, [
          'isChangeCoverModalVisible',
          'closeChangeCoverModal',
          'changeCoverImg'
        ])
      )
    );

  const { acts } = useParallelWorldConsumerStore(
    useShallow(state => selectState(state, ['acts']))
  );

  const [selectedImgIndex, setSelectedImgIndex] = useState<number>();

  const isLoading = false;

  const handleCoverChange = () => {
    if (selectedImgIndex === undefined) return;
    changeCoverImg(acts[selectedImgIndex]?.image as ActImage);
    closeChangeCoverModal();
  };

  return (
    <SheetModal
      isVisible={isChangeCoverModalVisible}
      onClose={closeChangeCoverModal}
      style={{ backgroundColor: parallelWorldColors.bg }}
      remainHeight={0}
      maskShown={true}
      maskOpacity={0.4}
      closeBtn={false}
      dragable={false}
      theme="dark"
    >
      {/* <View
        style={{
          height: 500
        }}
      > */}
      <View
        style={{
          ...$flexHCenter,
          justifyContent: 'space-between',
          paddingBottom: 12,
          paddingTop: 20,
          paddingHorizontal: 20
        }}
      >
        <View style={{ ...$flexHCenter, gap: 6 }}>
          <Icon icon="icon_edit_glow" size={17} />
          <Text
            style={{ fontSize: 16, fontWeight: '700', color: colors.white }}
          >
            编辑封面
          </Text>
        </View>
        <Pressable onPress={closeChangeCoverModal}>
          <Icon icon="close_dark_fill" size={26} />
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'stretch',
          position: 'relative'
        }}
      >
        <ImgGenGallery
          data={acts}
          // loadMore={() => {}}
          imageHeight={300}
          imageWidth={200}
          renderImage={({ item, index }, imgSize) => (
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
            >
              <View
                style={{
                  borderRadius: 12,
                  overflow: 'hidden'
                }}
              >
                {isLoading ? (
                  <ImageLoading
                    style={{
                      // backgroundColor: colors.white,
                      width: imgSize.width,
                      height: imgSize.height,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  />
                ) : (
                  <View
                    style={{
                      position: 'relative'
                    }}
                  >
                    <Image
                      source={item?.image?.imageUrl}
                      style={{
                        backgroundColor: colors.white,
                        width: imgSize.width,
                        height: imgSize.height,
                        position: 'relative',
                        borderRadius: 12
                      }}
                    ></Image>
                    <Radio
                      isActive={selectedImgIndex === index}
                      onPress={isSelected => {
                        if (isSelected) {
                          setSelectedImgIndex(index);
                        } else {
                          setSelectedImgIndex(undefined);
                        }
                      }}
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12
                      }}
                    ></Radio>
                  </View>
                )}
              </View>
            </View>
          )}
        />
        <View style={{ paddingHorizontal: 15, gap: 30 }}></View>
        <View
          style={{
            ...$flexHCenter,
            justifyContent: 'center',
            width: '100%',
            bottom: 0
          }}
        >
          <ParallelWorldButton
            title="设为封面"
            disabled={selectedImgIndex === undefined}
            onPress={handleCoverChange}
            style={{
              backgroundColor: 'rgba(127, 217, 255, 1)',
              width: 260
            }}
          />
        </View>
      </View>
      {/* </View> */}
    </SheetModal>
  );
};

export default CoverChangeModal;

const modalStyles = StyleSheet.create({});
