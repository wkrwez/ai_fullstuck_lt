import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlbumSheet } from '@/src/components/album';
import CreditCas, {
  CREDIT_LIMIT,
  CREDIT_TYPE,
  MINUS_BORDER_THEME2,
  MINUS_THEME2,
  PLUS_BORDER_THEME2,
  PLUS_THEME2,
  PURE_BORDER_MINUS2,
  PURE_BORDER_PLUS2
} from '@/src/components/credit-cas';
import { RoleSelector } from '@/src/components/makePhotoV2/photoRoleSelector';
import { useConfigStore } from '@/src/store/config';
import { useCreditStore } from '@/src/store/credit';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { usePublishStore } from '@/src/store/publish';
import {
  Source,
  addCommonReportParams,
  reportMakePhotoTrack
} from '@/src/utils/report';
import { Image } from '@Components/image';
import { BlueButton } from '@Components/makePhotoV2/button';
import {
  ElementSuffix,
  MakePhotoEvents,
  options
} from '@Components/makePhotoV2/constant';
import {
  LoadingView,
  LoadingViewRef
} from '@Components/makePhotoV2/loadingView';
import { Pannel } from '@Components/makePhotoV2/pannel';
import { AnimationElementsView } from '@Components/makePhotoV2/pannel/AnimationElementsView';
import { DoneSelectionIcon } from '@Components/makePhotoV2/pannel/DoneSelectionIcon';
import { PreviewView } from '@Components/makePhotoV2/previewView';
import { Screen } from '@Components/screen';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { useShallow } from 'zustand/react/shallow';

const $deleteButton: TextStyle = {
  fontSize: 14,
  fontWeight: '500',
  color: StyleSheet.currentColors.red
};

const BG_IMG = require('@Assets/makephoto/bg.jpg');

const theme = StyleSheet.currentColors.subset.blue;

const sourceMap = {
  [Source.HOME_ENTRY]: '0',
  [Source.DRAWING_WITH_PROMPT]: '1',
  [Source.DRAWING_WITH_CHARACTER]: '2'
};

export default function MakePhoto() {
  const { pageState, role2, currentSlot, makePhotoId } = useMakePhotoStoreV2(
    useShallow(state => ({
      currentSlot: state.currentSlot,
      pageState: state.pageState,
      role2: state.role2,
      makePhotoId: state.makePhotoId
    }))
  );
  const [showAlbum, setShowAlbum] = useState(false);
  const { from } = useLocalSearchParams();

  const { IPMap } = useConfigStore(
    useShallow(state => ({
      IPMap: state.makePhoto?.IPMap
    }))
  );

  const { ip, role, keyword } = useLocalSearchParams();

  const roles = useMemo(() => {
    return IPMap ? IPMap[Number(ip)]?.roles : [];
  }, [ip]);

  useEffect(() => {
    if (roles && ip) {
      useMakePhotoStoreV2.getState().setIp(Number(ip));

      if (role) {
        const findRole = roles.find(r => {
          return r.id === role;
        });
        useMakePhotoStoreV2.getState().changePageState(PageState.diy);
        useMakePhotoStoreV2.getState().selectRole(findRole!);
      } else {
        useMakePhotoStoreV2.getState().changePageState(PageState.roleselect);
      }
    }
  }, [ip, roles, role]);

  useEffect(() => {
    useMakePhotoStoreV2.getState().setState({
      keyword: String(keyword || '')
    });
  }, [keyword]);

  // const { brandInfos } = useBrandStore(
  //   useShallow(state => ({
  //     brandInfos: state.brandInfos
  //   }))
  // );

  useEffect(() => {
    addCommonReportParams('makephoto', { makephoto_id: makePhotoId });
    // // 首次上报延迟100ms
    // setTimeout(() => {
    //   addCommonReportParams('makephoto', { makephoto_id: makePhotoId });
    //   reportMakePhotoTrack(
    //     MakePhotoEvents.enter_paint,
    //     pageState,
    //     ElementSuffix.page_view,
    //     {
    //       source: sourceMap[from as Source]
    //     }
    //   );
    // }, 100);
  }, []);
  useEffect(() => {
    switch (pageState) {
      case PageState.diy: {
        reportMakePhotoTrack(
          MakePhotoEvents.prompt,
          PageState.promptselect,
          ElementSuffix.page_view,
          {
            source: sourceMap[from as Source]
          }
        );
        break;
      }
      default: {
        reportMakePhotoTrack(
          MakePhotoEvents.enter_paint,
          pageState,
          ElementSuffix.page_view,
          {
            source: sourceMap[from as Source]
          }
        );
      }
    }
  }, [pageState]);

  const loadingViewRef = useRef<LoadingViewRef>(null);

  const title = useMemo(() => {
    if (pageState === PageState.roleselect) {
      return '选择角色';
    }
    if (pageState === PageState.diy) {
      return '角色细节';
    }
    if (pageState === PageState.promptselect) {
      return currentSlot?.type
        ? '选择' + options[currentSlot?.type].label
        : '自由发挥';
    }
    return '炖图';
  }, [pageState, currentSlot]);

  const { totalCredits } = useCreditStore(
    useShallow(state => ({
      totalCredits: state.totalCredits
    }))
  );

  return (
    <>
      <Screen
        theme="dark"
        screenStyle={
          {
            // backgroundColor: theme.black
          }
        }
        backgroundView={
          <Image
            style={{
              position: 'absolute',
              top: 0,
              left: -1,
              bottom: 0,
              right: -1
            }}
            source={BG_IMG}
          ></Image>
        }
        onBack={onBack}
        headerLeft={() => {
          const moreThanLimit = totalCredits >= CREDIT_LIMIT;
          const theme = moreThanLimit ? CREDIT_TYPE.PLUS : CREDIT_TYPE.MINUS;
          return (
            <View style={{ position: 'absolute', left: 32 }}>
              <CreditCas
                theme={theme}
                text={`${totalCredits}`}
                borderColors={
                  moreThanLimit ? PLUS_BORDER_THEME2 : MINUS_BORDER_THEME2
                }
                insetsColors={moreThanLimit ? PLUS_THEME2 : MINUS_THEME2}
                $customTextStyle={{
                  color: '#fff',
                  fontSize: 12,
                  lineHeight: 22
                }}
                pureBorderColor={
                  moreThanLimit ? PURE_BORDER_PLUS2 : PURE_BORDER_MINUS2
                }
                size={20}
                hasPad
              ></CreditCas>
            </View>
          );
        }}
        headerRight={() =>
          role2 ? (
            <TouchableOpacity onPress={onDeleteRole}>
              <Text style={$deleteButton}>删除角色</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={showAlbumFunc}>
              <Text style={{ color: '#7FD9FF', fontWeight: '500' }}>
                狸史相册
              </Text>
            </TouchableOpacity>
          )
        }
        title={title}
      >
        <Pressable
          style={{
            padding: 0,
            paddingTop: 0,
            flex: 1,
            position: 'relative'
          }}
          onPress={onPress}
        >
          <RoleSelector disabled={pageState === PageState.promptselect} />
          <Pannel />
          {pageState === PageState.promptselect && (
            <DoneSelectionIcon onPress={onPress} />
          )}
        </Pressable>
      </Screen>
      <LoadingView ref={loadingViewRef} onBack={onBack} />
      <PreviewView
        onBack={onBack}
        showAlbum={showAlbumFunc}
        resetLoading={resetLoading}
      />
      <AlbumSheet
        isVisible={showAlbum}
        onClose={() => {
          setShowAlbum(false);
        }}
        resetLoading={resetLoading}
      />
    </>
  );

  function resetLoading() {
    loadingViewRef.current?.reset();
  }

  function onPress() {
    const { pageState, changePageState } = useMakePhotoStoreV2.getState();
    if (pageState === PageState.promptselect) {
      changePageState(PageState.diy);
    }
  }

  function onBack() {
    const { pageState, changePageState } = useMakePhotoStoreV2.getState();
    if (
      pageState === PageState.preview ||
      pageState === PageState.styleselect
    ) {
      loadingViewRef.current?.reset();
      changePageState(PageState.diy);
    } else {
      router.back();
    }
  }

  function onDeleteRole() {
    useMakePhotoStoreV2.getState().deleteCurrentRole();
  }

  function showAlbumFunc() {
    usePublishStore.getState().getAlbumPhotos(true);
    reportMakePhotoTrack(
      MakePhotoEvents.album_click,
      PageState.preview,
      ElementSuffix.album
    );
    setShowAlbum(true);
  }
}
