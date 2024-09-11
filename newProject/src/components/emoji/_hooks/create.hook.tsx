import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { UploadEmojiResponse, uploadEmojiImg } from '@/src/api';
import {
  RecreateEmojiRequest,
  getEmojiRecText,
  publishAndSaveEmoji
} from '@/src/api/emoji';
import { hideLoading, showLoading, showToast } from '@/src/components';
import { AdviceItem } from '@/src/components/adviceInput';
import { RoleSelectorState } from '@/src/components/emoji/emojiRoleselector';
import { selectState } from '@/src/store/_utils';
import { useEmojiStore } from '@/src/store/emoji';
import { EmojiRoleInfo, useEmojiCreatorStore } from '@/src/store/emoji-creator';
import { RoleItemType } from '@/src/types';
import { logWarn } from '@/src/utils/error-log';
import { reportClick } from '@/src/utils/report';
import { EMOJI_SIZE, RECREATE_TYPE } from '../_constants';
import { EmojiInfo } from '@/proto-registry/src/web/raccoon/emoji/emoji_pb';

// 角色选择相关逻辑
export const useRoleSelect = ({
  defaultRoleInfo
}: {
  defaultRoleInfo: EmojiRoleInfo | null;
}) => {
  const [curRoleInfo, setCurRoleInfo] = useState(defaultRoleInfo);

  const [roleInfoBackup, setRoleInfoBackup] = useState<EmojiRoleInfo>();

  const [roleSelectState, setRoleSelectState] = useState(
    RoleSelectorState.show
  );

  const handleRoleSelect = (role: RoleItemType) => {
    const roleInfo = {
      brandType: role.ip,
      role: role.id
    };
    setCurRoleInfo(roleInfo);
  };

  const handleToggleRoleSelect = (state: RoleSelectorState, isExit = false) => {
    setRoleSelectState(state);
    if (state === RoleSelectorState.select) {
      setRoleInfoBackup(curRoleInfo as EmojiRoleInfo);
    }
    if (state === RoleSelectorState.show && isExit) {
      setCurRoleInfo(roleInfoBackup as EmojiRoleInfo);
    }
  };

  return {
    defaultRoleInfo,
    curRoleInfo,
    setCurRoleInfo,
    roleSelectState,
    setRoleSelectState,
    handleRoleSelect,
    handleToggleRoleSelect
  };
};

// 输入相关逻辑
export const useAdviceInput = ({
  onCreate,
  curRoleInfo
}: {
  onCreate: (
    type: RECREATE_TYPE,
    payload?: Partial<RecreateEmojiRequest>
  ) => Promise<void>;
  curRoleInfo: EmojiRoleInfo;
}) => {
  const { emojiInfo } = useEmojiCreatorStore(state =>
    selectState(state, ['emojiInfo'])
  );
  const [emojiText, setEmojiText] = useState<string>('');
  // const emojiTextBackup = useRef('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [adviceList, setAdviceList] = useState<AdviceItem[]>([]);

  const $focused = useSharedValue(false);

  const hideInput = () => {
    setIsInputVisible(false);
    $focused.value = false;
  };

  const handleBlur = useMemoizedFn(() => {
    if (isInputVisible) {
      // 手动关闭要恢复成表情包文案
      setEmojiText(emojiInfo?.text ?? '');
      hideInput();
    }
  });

  const handleFocus = useMemoizedFn(() => {
    if (!isInputVisible) {
      setIsInputVisible(true);
      $focused.value = true;
    }
  });

  const { run: handleSubmitTextChange } = useDebounceFn(
    () => {
      hideInput();
      onCreate(RECREATE_TYPE.INPUT);
    },
    { wait: 100 }
  );

  const { run: handleSubmitAdviceSelect } = useDebounceFn(
    (text: string) => {
      setEmojiText(text);
      onCreate(RECREATE_TYPE.ADVICE, { prompt: text });
      hideInput();
    },
    { wait: 100 }
  );

  const getAdvice = async (isReplace = false) => {
    if (curRoleInfo) {
      const res = await getEmojiRecText({
        brandId: curRoleInfo?.brandType,
        roleIds: [curRoleInfo?.role]
      });
      const advices = res.recText.map(text => ({ text }));
      if (isReplace) {
        setAdviceList(advices);
      } else {
        setAdviceList(l => [...l, ...advices]);
      }
    }
  };

  return {
    emojiText,
    setEmojiText,
    isInputVisible,
    setIsInputVisible,
    adviceList,
    setAdviceList,
    getAdvice,
    $focused,
    handleBlur,
    handleFocus,
    handleSubmitTextChange,
    handleSubmitAdviceSelect
  };
};

// 保存相关逻辑
export const useEmojiSave = ({
  emojiText,
  curRoleInfo,
  toggleCursor
}: {
  emojiText: string;
  curRoleInfo: EmojiRoleInfo | null;
  toggleCursor: (isVisible: boolean) => void;
}) => {
  const { cardInfo, changeEmoji, emojiInfo } = useEmojiCreatorStore(
    state => state
  );

  const { init: initEmoji } = useEmojiStore(state => state);

  const emojiRef = useRef<View>();

  const [savedEmoji, setSavedEmoji] = useState<EmojiInfo | undefined>();

  const isSaved = useMemo(() => {
    return (
      savedEmoji?.emojiId === emojiInfo?.emojiId &&
      savedEmoji?.text === emojiText
    );
  }, [savedEmoji, emojiInfo, emojiText]);

  const uploadEmoji = async (): Promise<UploadEmojiResponse | void> => {
    toggleCursor(false);
    // toggleCursor有延迟
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const localUri = await captureRef(emojiRef, {
            height: EMOJI_SIZE,
            quality: 1
          });
          toggleCursor(true);
          const res = await uploadEmojiImg(localUri);
          resolve(res);
        } catch (e) {
          reject(e);
          logWarn('uploadEmoji', e);
        }
      });
    });
  };

  const handleSave = async (
    callback?: (newEmoji: EmojiInfo | undefined) => void
  ) => {
    try {
      showLoading();
      let now = Date.now();
      // 上传带文字的表情包
      const uploadRes = await uploadEmoji();

      console.log('save spend--->', Date.now() - now);

      now = Date.now();

      const canSave =
        uploadRes?.image_url &&
        uploadRes?.image_id &&
        curRoleInfo &&
        cardInfo &&
        emojiInfo;

      if (canSave) {
        const payload = {
          emoji: {
            rawUri: emojiInfo?.rawUri,
            text: emojiText,
            wholeImageUrl: uploadRes.image_url,
            wholeImageUri: uploadRes.image_id
          } as EmojiInfo,
          cardId: cardInfo.cardId,
          brandId: curRoleInfo.brandType,
          roleIds: [curRoleInfo.role],
          baseEmojiId: emojiInfo.emojiId
        };
        // 保存表情包
        console.log('save payload------>', payload);
        const res = await publishAndSaveEmoji(payload);

        console.log('upload spend--->', Date.now() - now);

        console.log('save res------>', res);

        // 修改数据
        changeEmoji(res?.emojiInfo ?? null);
        setSavedEmoji(res?.emojiInfo);

        // 初始化表情包列表
        initEmoji();

        if (callback) {
          // 执行回调函数
          callback(res.emojiInfo);
        } else {
          reportClick('attend_self_button', {
            emoji_id: res?.emojiId ?? ''
          });
          showToast(
            <View style={{ backgroundColor: 'transparent' }}>
              <Text style={{ color: '#fff' }}>添加成功</Text>
            </View>
          );
        }
      } else {
        throw new Error('saveEmojiError');
      }
    } catch (e) {
      logWarn('handleSave', e);
      showToast(
        <View style={{ backgroundColor: 'transparent' }}>
          <Text style={{ color: '#fff' }}>添加失败</Text>
        </View>
      );
      logWarn('saveEmojiError', e);
    } finally {
      hideLoading();
    }
  };

  return {
    emojiRef,
    savedEmoji,
    setSavedEmoji,
    isSaved,
    uploadEmoji,
    handleSave
  };
};
