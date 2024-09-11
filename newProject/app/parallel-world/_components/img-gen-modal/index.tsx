import { ResizeMode, Video } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { createActImage } from '@/src/api/parallel-world/consumer';
import { Icon, Image, SheetModal, showToast } from '@/src/components';
import { useImgPreview } from '@/src/components/emoji/_hooks/img-preview.hook';
import PreloadImg from '@/src/components/emoji/preload-img';
import { selectState } from '@/src/store/_utils';
import { useParallelWorldConsumerStore } from '@/src/store/parallel-world-consumer';
import { colors, typography } from '@/src/theme';
import { $flexHCenter } from '@/src/theme/variable';
import { createStyle } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { PW_PURE_BG_VIDEO, parallelWorldColors } from '../../_constants';
import { REVIEW_ERR_ENUM, showErr } from '../../_utils/error-msg';
import ImgGenDescModal from '../comsumer-input-modal/img-gen-desc-modal';
import ImgGenGallery from '../img-gen-gallery';
import ImageLoading from '../loading/image-loading';
import AiPressableInput from '../others/ai-pressable-input';
import LoadingImg from '../others/loading-img';
import ParallelWorldButton from '../others/parallel-world-button';
import Radio from '../others/radio';
import {
  ActImage,
  WorldAct
} from '@/proto-registry/src/web/raccoon/world/common_pb';
import { logWarn } from '@step.ai/logging-module';
import { useShallow } from 'zustand/react/shallow';

const getImgStateFromStore = (actId: string) => {
  const state = useParallelWorldConsumerStore.getState();
  return state.genImgMap[actId];
};

export const ImgGenModal = () => {
  const {
    closeImgGenModal,
    imgGenAct,
    changeEditableActs,
    newTimeLine,
    activeTimelineSectionIdx,
    editableActs,
    changeGenImgMap
  } = useParallelWorldConsumerStore(
    useShallow(state =>
      selectState(state, [
        'closeImgGenModal',
        'imgGenAct',
        'changeEditableActs',
        'newTimeLine',
        'activeTimelineSectionIdx',
        'editableActs',
        'changeGenImgMap'
      ])
    )
  );

  const [selectedImgIndex, setSelectedImgIndex] = useState<number>();

  const [inEditDesc, setInEditDesc] = useState<string>('');

  const { entering, exiting, isImgLoaded, setIsImgLoaded } = useImgPreview();

  // 可见状态放在内部管理，外部只负责组件销毁
  const [visible, setVisible] = useState<boolean>(true);

  const imgState = getImgStateFromStore(imgGenAct?.actId as string);

  const inputRef = useRef<TextInput>(null);

  const galleryRef = useRef<{
    galleryInstance: ICarouselInstance | null;
  }>(null);

  // 初始化图片列表
  const initImgList = ({
    actId,
    desc,
    count,
    isRefresh
  }: {
    actId: string;
    desc: string;
    count: number;
    isRefresh: boolean;
  }) => {
    // 初始化列表占位
    const appendList = Array(count).fill(null);
    if (isRefresh) {
      changeGenImgMap(actId, {
        desc: desc,
        img: appendList,
        isLoading: true
      });
    } else {
      changeGenImgMap(actId, {
        desc: desc,
        img: [...imgState.img, ...appendList],
        isLoading: true
      });
      // 滑动到最新的图片第一个
      setTimeout(() => {
        galleryRef.current?.galleryInstance?.scrollTo({
          index: imgState?.img?.length ?? 0,
          animated: true
        });
      });
    }
  };

  // 获取相关的acts
  const getRelatedActs = ({
    isUserPrompt,
    act
  }: {
    isUserPrompt: boolean;
    act: WorldAct;
  }) => {
    let relatedActs: WorldAct[] = [];
    if (!isUserPrompt) {
      const actsBegin = act.actIndex - 2 > 0 ? act.actIndex - 2 : 0;
      // 生成图片的时候，只生成当前act之前的图片
      relatedActs = (editableActs as WorldAct[]).slice(
        actsBegin,
        act.actIndex + 1
      );
    }
    return relatedActs;
  };

  // 处理图片生成
  const generateImg = ({
    image,
    desc,
    actId
  }: {
    image: ActImage;
    desc: string;
    actId: string;
  }) => {
    const imgState = getImgStateFromStore(actId);
    const newList = [...imgState.img];
    const replaceIndex = newList.findIndex(item => item === null);
    newList[replaceIndex] = image as ActImage;

    changeGenImgMap(actId, {
      desc: desc,
      img: newList,
      isLoading: true
    });
  };

  // 处理生成失败的逻辑
  const generateError = ({ actId, desc }: { actId: string; desc: string }) => {
    const imgState = getImgStateFromStore(actId);
    const notNullImgList = imgState.img.filter(item => item !== null);
    changeGenImgMap(actId, {
      desc: desc,
      img: notNullImgList,
      isLoading: false
    });
    galleryRef.current?.galleryInstance?.scrollTo({
      index: notNullImgList.length - 1
    });
  };

  // 生成图片
  const handleImgGen = (
    params: { count: number; desc: string; actId: string },
    isRefresh: boolean = false
  ) => {
    if (!imgGenAct?.actId) return;

    initImgList({
      actId: imgGenAct.actId,
      desc: params.desc,
      count: params.count,
      isRefresh
    });

    // 是否存在用户输入
    const isUserPrompt = params.desc !== imgGenAct?.image?.desc;

    const relatedActs = getRelatedActs({ isUserPrompt, act: imgGenAct });

    const payload = {
      userPrompt: isUserPrompt,
      plotId: newTimeLine[activeTimelineSectionIdx]?.plotId,
      act: relatedActs,
      ...params
    };

    createActImage(
      payload,
      d => {
        if (d.isFinish) {
          const imgState = getImgStateFromStore(imgGenAct.actId);

          changeGenImgMap(imgGenAct.actId, {
            desc: params.desc,
            img: imgState.img.filter(item => item !== null),
            isLoading: false
          });
        }

        if (d.image) {
          generateImg({
            image: d.image as ActImage,
            desc: params.desc,
            actId: imgGenAct.actId
          });
        }
      },
      e => {
        showErr(e, REVIEW_ERR_ENUM.IMG_DESC);

        generateError({ actId: imgGenAct.actId, desc: params.desc });

        setTimeout(() => {
          galleryRef.current?.galleryInstance?.scrollTo({
            index: 0,
            animated: true
          });
        });
        logWarn('createActImage', JSON.stringify(e));
        console.log('createActImage payload is', payload);
      }
    );
  };

  // 处理描述编辑
  const handleDescEdit = () => {
    const imgState = getImgStateFromStore(imgGenAct?.actId ?? '');

    setInEditDesc(imgState?.desc ?? '');
    setVisible(false);
  };

  // 图片更改
  const handleSubmit = () => {
    if (selectedImgIndex === undefined) return;

    const newActs = editableActs.map(act => {
      if (act?.actIndex === imgGenAct?.actIndex) {
        return {
          ...act,
          image: imgState?.img[selectedImgIndex]
        };
      } else {
        return act;
      }
    }) as WorldAct[];

    changeEditableActs(newActs);
    closeImgGenModal();
  };

  // 处理描述关闭
  const handleDescClose = () => {
    setInEditDesc('');
    setVisible(true);
  };

  // 处理描述提交
  const handleDescSubmit = () => {
    handleImgGen({
      count: 3,
      desc: inEditDesc,
      actId: imgGenAct?.actId as string
    });
    handleDescClose();
  };

  const handleDescFocus = () => {
    inputRef.current?.focus();
  };

  // 初始化
  useEffect(() => {
    if (!imgState?.img?.length && !imgState?.isLoading) {
      handleImgGen(
        {
          count: 3,
          desc: imgGenAct?.image?.desc ?? '',
          actId: imgGenAct?.actId as string
        },
        true
      );
    } else {
      const defaultActive = imgState.img.findIndex(
        item => item?.imageId === imgGenAct?.image?.imageId
      );

      setSelectedImgIndex(defaultActive);

      setTimeout(() => {
        galleryRef.current?.galleryInstance?.scrollTo({
          index: defaultActive,
          animated: true
        });
      });
    }
    reportExpo('world_editing_image', {
      actid: imgGenAct?.actId
    });
  }, []);

  return (
    <>
      <SheetModal
        isVisible={visible}
        onClose={closeImgGenModal}
        remainHeight={0}
        style={{
          backgroundColor: parallelWorldColors.bg
        }}
        maskShown={true}
        maskOpacity={0.4}
        closeBtn={false}
        dragable={false}
        theme="dark"
      >
        <View style={styles.$container}>
          <View style={styles.$header}>
            <Icon icon="icon_ai_stroked" size={17} />
            <Text style={styles.$title}>换一张图片</Text>
          </View>
          <Pressable onPress={closeImgGenModal}>
            <Icon icon="close_dark_fill" size={26} />
          </Pressable>
        </View>
        <View style={styles.$gallerySection}>
          <ImgGenGallery
            ref={galleryRef}
            data={imgState?.img ?? []}
            loadMore={
              !imgState?.isLoading
                ? () => {
                    handleImgGen({
                      count: 1,
                      desc: imgState?.desc,
                      actId: imgGenAct?.actId as string
                    });
                  }
                : undefined
            }
            imageHeight={270}
            imageWidth={180}
            renderImage={({ item, index }, imgSize) => {
              const isLoading = imgState?.isLoading && !item;
              return (
                <View key={item?.imageId} style={styles.$imgContainer}>
                  <View style={styles.$imgBox}>
                    <LoadingImg
                      url={item?.imageUrl ?? ''}
                      isLoading={isLoading}
                      size={imgSize}
                    />

                    {!isLoading && (
                      <Radio
                        isActive={selectedImgIndex === index}
                        onPress={isSelected => {
                          if (isSelected) {
                            setSelectedImgIndex(index);
                          } else {
                            setSelectedImgIndex(undefined);
                          }
                        }}
                        style={styles.$selectRadio}
                      />
                    )}
                  </View>
                </View>
              );
            }}
          />
          <View style={{ paddingHorizontal: 16 }}>
            <AiPressableInput
              disabled={imgState?.isLoading}
              labelNode={<Text style={inputStyles.$label}>生图描述</Text>}
              textNode={
                <View style={inputStyles.$textArea}>
                  <Text style={inputStyles.$placeholder} numberOfLines={1}>
                    {imgState?.desc ?? ''}
                  </Text>
                  <Icon icon="icon_edit_glow" size={16} />
                </View>
              }
              onInputPress={handleDescEdit}
              outlineStyle={inputStyles.$container}
            />
          </View>
          <View style={btnStyles.$container}>
            <ParallelWorldButton
              onPress={closeImgGenModal}
              title="取消"
              style={btnStyles.$cancel}
            />
            <ParallelWorldButton
              title="确认替换"
              disabled={selectedImgIndex === undefined}
              onPress={handleSubmit}
              style={btnStyles.$submit}
            />
          </View>
        </View>
      </SheetModal>
      {!visible && (
        <ImgGenDescModal
          ref={inputRef}
          value={inEditDesc}
          onChange={text => {
            setInEditDesc(text);
          }}
          onSubmit={handleDescSubmit}
          onClose={handleDescClose}
          isVisible={!visible}
          onFocus={handleDescFocus}
        />
      )}
    </>
  );
};

const styles = createStyle({
  $container: {
    ...$flexHCenter,
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingTop: 20,
    paddingHorizontal: 20
  },
  $header: { ...$flexHCenter, gap: 4 },
  $title: { fontSize: 16, fontWeight: '700', color: colors.white },
  $gallerySection: {
    flex: 1,
    alignItems: 'stretch',
    gap: 24,
    position: 'relative'
  },
  $imgContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  $imgBox: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden'
  },
  $selectRadio: {
    position: 'absolute',
    bottom: 12,
    right: 12
  }
});

const inputStyles = createStyle({
  $container: { height: 48, padding: 0 },
  $label: { color: '#fff', fontWeight: '500' },
  $textArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  $placeholder: {
    color: parallelWorldColors.fontGlow,
    fontFamily: typography.fonts.world,
    fontSize: 16,
    fontWeight: '400'
  }
});

const btnStyles = createStyle({
  $container: {
    ...$flexHCenter,
    gap: 18,
    paddingHorizontal: 16,
    justifyContent: 'center',
    width: '100%',
    bottom: 0
  },
  $cancel: {
    backgroundColor: 'transparent',
    borderColor: parallelWorldColors.fontGlow,
    borderWidth: 1,
    width: 134
  },
  $submit: {
    flex: 1,
    backgroundColor: 'rgba(127, 217, 255, 1)',
    width: 134
  }
});
