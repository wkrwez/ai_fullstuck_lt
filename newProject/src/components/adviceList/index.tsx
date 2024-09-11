import dayjs from 'dayjs';
import {
  MutableRefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Button,
  Dimensions,
  ImageStyle,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { CommentClient } from '@/src/api/comment';
import { FullScreen, SheetModal, showToast } from '@/src/components';
import { DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useAppStore } from '@/src/store/app';
import { useDetailStore } from '@/src/store/detail';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { AdviceTitle } from '@/src/store/publish';
import { dp2px, isIos } from '@/src/utils';
import { reportClick, reportExpo, reportPage } from '@/src/utils/report';
import { uuid } from '@/src/utils/uuid';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { Loading } from '@Components/promptLoading';
import { StyleSheet } from '@Utils/StyleSheet';
import { DetailEventBus } from '@/app/detail/eventbus';
import {
  CommentItem,
  PublishCommentReq,
  QueryCommentsReq
} from '@/proto-registry/src/web/raccoon/comment/comment_pb';
import { useShallow } from 'zustand/react/shallow';

const $inputWrap: ViewStyle = {
  paddingLeft: 10,
  paddingTop: 18,
  paddingBottom: 0,
  paddingRight: 10,
  position: 'absolute',
  backgroundColor: '#fff',
  width: '100%',
  // height: 300,
  bottom: 0,
  left: 0
};
const $inputStyle: TextStyle = {
  paddingTop: 18,
  paddingBottom: 18,
  paddingLeft: 10,
  paddingRight: 10,
  backgroundColor: '#F5F7F8',
  borderRadius: 10,
  color: '#83A9C4',
  fontSize: 16,
  fontWeight: '500'
};

const $buttonStyle: ViewStyle = {
  position: 'absolute',
  top: 24,
  right: 16,
  backgroundColor: '#83A9C4',
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 20,
  paddingRight: 20,
  borderRadius: 10
};

const $inputTag: ViewStyle = {
  ...StyleSheet.rowStyle,
  paddingHorizontal: 16,
  paddingVertical: 8,
  // paddingTop: 10,
  // paddingBottom: 10,
  // paddingLeft: 7,
  // paddingRight: 7,
  borderRadius: 500,
  borderWidth: 0.75,
  borderColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.07),
  gap: 4
};

const $iputTagText: TextStyle = {
  color: StyleSheet.currentColors.black,
  fontWeight: '500',
  lineHeight: 20,
  top: Platform.OS === 'android' ? -1 : 0,
  fontSize: 14
};
interface InputTagProps {
  item: AdviceTitle;
  onSelect: (item: AdviceTitle) => void;
}
function InputTag(props: InputTagProps) {
  return (
    <TouchableOpacity style={$inputTag} onPress={onPress}>
      <Text style={$iputTagText}>{props.item.text}</Text>
      <Icon icon="up_arrow" size={10} />
    </TouchableOpacity>
  );

  function onPress() {
    props.onSelect(props.item);
  }
}

interface AdviceInputProps {
  refreshParams: unknown;
  fetchList: () => Promise<AdviceTitle[]>;
  onSelect: (value: string) => void;
  visitID: string;
  refresh?: boolean;
  reportEditIdRef: MutableRefObject<string>;
  visible: boolean; // 用于监听埋点上报
}
export function AdviceInput(props: AdviceInputProps) {
  const [recList, setRecList] = useState<AdviceTitle[]>([]);
  const loadingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const [loading, setLoading] = useState(false);
  const animateStep = useSharedValue(0);
  const reportedRef = useRef(0);
  //   useEffect(() => {
  //     setRecList(props.presetList || []);
  //   }, [props.presetList]);
  useEffect(() => {
    if (!props.refreshParams) return;
    setTimeout(() => {
      props.fetchList().then(res => {
        console.log('fetchList', res, props.refreshParams);
        setRecList(res);
        // res.forEach((item, index) => {
        //   reportExpo('picwrite_rec_title', {
        //     page_visit_id: props.visitID,
        //     title_edit_id: titleIdRef.current,
        //     trace_index: index,
        //     total_index: recRef.current + index,
        //     title: item
        //   });
        // });
      });
    });
  }, [props.refreshParams]);

  useEffect(() => {
    if (!props.visible) return;
    if (reportedRef.current < recList.length) {
      recList.forEach((item, index) => {
        if (index < reportedRef.current) return;
        reportExpo('picwrite_rec_title', {
          page_visit_id: props.visitID,
          title_edit_id: props?.reportEditIdRef?.current,
          trace_index: item.index,
          total_index: index,
          title: item.text,
          trace_id: item.traceid
        });
      });
    }
  }, [props.visible, recList]);

  const hasRecs = recList.length > 0;

  // 上报相关
  const titleIdRef = useRef('');
  const recRef = useRef(0);

  useEffect(() => {
    titleIdRef.current = uuid();
  }, []);

  useEffect(() => {
    if (hasRecs) {
      animateStep.value = withTiming(1);
    } else {
      animateStep.value = withTiming(0);
    }
  }, [hasRecs]);

  const $animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animateStep.value,
      transform: [
        {
          translateY: (1 - animateStep.value) * 32
        }
      ]
    };
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: StyleSheet.currentColors.white,
          width: '100%'
        },
        $animatedStyle
      ]}
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        // keyboardDismissMode="none"
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
      >
        <View
          style={[
            StyleSheet.rowStyle,
            {
              height: 50,
              padding: 7,
              gap: 8
            }
          ]}
        >
          {recList?.map((item, index) => (
            <InputTag
              key={index}
              item={item}
              onSelect={t => {
                props.onSelect(t.text);
                reportClick('picwrite_rec_title', {
                  page_visit_id: props.visitID,
                  title_edit_id: props?.reportEditIdRef?.current,
                  trace_index: item.index,
                  total_index: index,
                  title: item.text,
                  trace_id: t.traceid
                });
              }}
            />
          ))}
          {loading && <Loading style={{ opacity: 0.5 }} />}
        </View>
      </ScrollView>
    </Animated.View>
  );

  function onMomentumScrollEnd() {
    if (props.refresh === false) return;
    if (debounceRef.current) {
      return;
    }
    debounceRef.current = setTimeout(() => {
      debounceRef.current = undefined;
    }, 300);
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    props
      .fetchList()
      .then(res => {
        setRecList(v => {
          recRef.current = v.length;
          return v.concat(res);
        });
        loadingRef.current = false;
        setLoading(false);

        // res.forEach((item, index) => {
        //   reportExpo('picwrite_rec_title', {
        //     page_visit_id: props.visitID,
        //     title_edit_id: titleIdRef.current,
        //     trace_index: index,
        //     total_index: recRef.current + index,
        //     title: item
        //   });
        // });
      })
      .catch(e => {
        loadingRef.current = false;
        setLoading(false);
      });
  }
}
