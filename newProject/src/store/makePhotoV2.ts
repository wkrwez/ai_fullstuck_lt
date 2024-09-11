// todo 双人状态判定要整理一下
import * as Haptics from 'expo-haptics';
import { create } from 'zustand';
import {
  GenFeaturePrompt,
  GenFeaturePrompts,
  GetClientConfig,
  GetMyPhotos,
  TakePhoto
} from '@/src/api/makephotov2';
import { config, options } from '@/src/components/makePhotoV2/constant';
import { omit } from '@/src/utils/omit';
import { type PromptsArrType, parsePrompts } from '@/src/utils/prompt';
import { PromptType } from '@Components/makePhotoV2/constant';
import { replace } from '@Utils/replace';
import { Socket } from '../api/websocket';
import { ErrorRes } from '../api/websocket/stream_connect';
import { showToast } from '../components';
import { GameType, InvokeType, RoleItemType } from '../types';
import { logWarn, requestErrorLog } from '../utils/error-log';
import {
  getPageID,
  reportClick,
  reportExpo,
  reportTimeStart
} from '../utils/report';
import { uuid } from '../utils/uuid';
import { strategyUpdateHandle } from '@/app/credit/error';
import { CensoredState } from '@/proto-registry/src/web/raccoon/common/state_pb';
import {
  GenFeaturePromptResponse,
  Photo,
  PhotoProgress,
  PhotoTaskState,
  Role
} from '@/proto-registry/src/web/raccoon/makephoto/makephoto_pb';
import { PartialMessage } from '@bufbuild/protobuf';
import { useConfigStore } from './config';
import { useCreditStore } from './credit';
import { useStorageStore } from './storage';

// todo
const mapIP = {
  'Demon Slayer': 2001,
  2001: 2001,
  'Jujutsu Kaisen': 2002,
  2002: 2002
};

export enum PageState {
  roleselect = 'roleselect', // 角色选择
  diy = 'diy', // 编辑
  promptselect = 'promptselect', // 表情等选择
  styleselect = 'styleselect', // 风格选择
  effect = 'effect', // 炖
  preview = 'preview' // 预览
}

export type SelectedItemType = {
  id: string;
  type: string;
  text?: string;
  position: { x: number; y: number };
};

type SelectedElementsType = {
  [key in string]: SelectedItemType;
};

type CachePromptsType = {
  [key in PromptType]?: string[] | null;
};

export type PresetPromptsItemType = {
  type: 'custom' | 'preset';
  text: string;
};

export type PresetPromptsType = {
  [key in PromptType]?: PresetPromptsItemType;
};

type syncDataProps = {
  prompt?: string;
  protoId?: string;
  roles: Role[];
  style?: string;
  cardId?: string;
};

type States = {
  isSwitch: boolean; // 切换角色，临时状态
  useDouble: boolean;
  pageState: PageState;
  currentSlot?: SlotType | null;
  selectedElements: SelectedElementsType;
  // 所选角色2
  selectedElements2: SelectedElementsType;
  inputVisible: boolean;
  inputType: PromptType | null; // 输入框类型
  defaultInputText?: string;
  // 当前所选第几个角色
  selectedRoleIndex: number;
  // 所选角色1
  role1: RoleItemType | null;
  // 所选角色2
  role2: RoleItemType | null;
  // 当前操作角色
  currentRole: RoleItemType | null;
  // ip
  ip: number;
  // 已请求到的prompts
  cachePrompts: CachePromptsType;
  // 当前prompts们
  additionPrompts: string[];
  presetPrompts: PresetPromptsType;
  // 角色2的prompts
  additionPrompts2: string[];
  presetPrompts2: PresetPromptsType;
  // 风格
  style: string;
  // 等待生图的promise
  $pendingPhoto: null | Promise<unknown>;
  // 是否正在生图
  photoLoading: boolean;
  // 图片
  photos: PartialMessage<PhotoProgress>[];
  // todo 重置视频状态 临时
  retryState: number;
  referenceCardId: string;
  referenceProtoId: string;
  // 小狸大乱炖loading
  promptLoading: boolean;
  // 进入捏图模块的用户id（退出重新进入界面将会沿用，但同一用户完整的生图流程跑完后，下一次生图将重新给一个id）
  makePhotoId: string;
  promptGenerateType: 3 | 2 | 1;
  keyword: string;
};

type Actions = {
  changePageState: (pageState: PageState) => void;
  setCurrentSlot: (payload: SlotType) => void;
  getConfig: () => void;
  setSelectedElements: (item: SelectedElementsType) => void;
  changeBottomInputShow: (
    visible: boolean,
    type?: PromptType,
    text?: string
  ) => void;
  selectRole: (payload: RoleItemType) => void;
  setIp: (payload: number) => void;
  getPrompt: (type: PromptType) => Promise<string[]>;
  addPrompt: (
    type: PromptType,
    item: PresetPromptsItemType & { remove?: string }
  ) => void;
  removePrompt: (type: PromptType, text?: string) => void;
  takePhoto: (extraInfo?: Record<string, any>) => void;
  setStyle: (str: string) => void;
  autoPrompts: () => Promise<unknown>;
  getRoles: () => Role[];
  pendingTakePhoto: () => Promise<unknown>;
  setRoleType: (payload: number) => void;
  reset: () => void;
  setRetryState: (payload: number) => void; // todo 临时
  resetTakePhoto: () => void;
  syncData: (payload: syncDataProps) => void;
  // findRole: (role: Role) => RoleItemType | undefined;
  enableDouble: () => void;
  deleteCurrentRole: () => void;
  setState: (states: Partial<States>) => void;
  updateAdditionPrompts: (text: string, remove?: string) => void;
  getCurrentPrompts: () => {
    additionPrompts: string[];
    presetPrompts: PresetPromptsType;
    selectedElements: SelectedElementsType;
    additionPromptKey: 'additionPrompts' | 'additionPrompts2';
    presetPromptsKey: 'presetPrompts' | 'presetPrompts2';
    selectedElementsKey: 'selectedElements' | 'selectedElements2';
  };
};

type SlotType = {
  x: number;
  y: number;
  type: PromptType;
};

const resetState = () => {
  return {
    isSwitch: false, // 切换角色 todo 临时状态
    style: '',
    // refs: [],
    pageState: PageState.roleselect,
    currentSlot: null,
    selectedElements: {},
    selectedElements2: {},
    selectedRoleIndex: 0,
    photos: [],
    // roles: [],
    role1: null,
    role2: null,
    currentRole: null,
    inputVisible: false,
    inputType: null,
    ip: useStorageStore.getState().makePhotoIp || 2001,
    cachePrompts: {},
    currentPrompts: {},
    additionPrompts: [],
    presetPrompts: {},
    additionPrompts2: [],
    presetPrompts2: {},
    photoLoading: false,
    $pendingPhoto: null,
    retryState: 0,
    referenceCardId: '',
    referenceProtoId: '',
    promptLoading: false,
    makePhotoId: uuid(),
    promptGenerateType: 3 as 3,
    keyword: '' // 预设标签 临时
  };
};
export const useMakePhotoStoreV2 = create<States & Actions>()((set, get) => ({
  useDouble: true,
  // promptLoading: false,
  ...resetState(),
  setState(states) {
    set(states);
  },
  enableDouble() {
    set({ useDouble: true });
  },
  setIp(ip: number) {
    // @ts-ignore
    set({ ip: mapIP[ip] || ip });
    useStorageStore.getState().__setStorage({
      makePhotoIp: ip
    });
  },
  // findRole(role) {
  //   return (
  //     role &&
  //     useConfigStore.getState().roles?.find(item => item.id === role.role)
  //   );
  // },
  syncData(paylaod) {
    const { prompt, protoId, roles, style, cardId } = paylaod;
    const { findRole } = useConfigStore.getState();
    const role1 = findRole(roles[0]);
    const role2 = findRole(roles[1]);

    const [prompt1, prompt2] = (prompt || '').split(';');

    get().reset();

    if (role1) {
      set({
        role1,
        currentRole: role1,
        // @ts-ignore
        ip: mapIP[role1.ip] || role1.ip
      });
    }

    if (style) {
      const { addition, ...others } = parsePrompts<PromptType>(prompt1 || '');
      const presetPrompts = getPresetPrompts(others);
      set({
        style,
        referenceCardId: cardId,
        referenceProtoId: protoId,
        additionPrompts: addition || [],
        // @ts-ignore todo
        presetPrompts,
        // @ts-ignore todo
        selectedElements: getSelectedElements(others)
      });
    }

    if (role2) {
      const { addition, ...others } = parsePrompts<PromptType>(prompt2 || '');
      const presetPrompts = getPresetPrompts(others);
      set({
        role2,
        additionPrompts2: addition || [],
        // @ts-ignore todo
        presetPrompts2: presetPrompts,
        // @ts-ignore todo
        selectedElements2: getSelectedElements(others)
      });
    } else {
      set({
        role2: null,
        additionPrompts2: [],
        presetPrompts2: {}
      });
    }

    // alert(prompt);
    // alert(prompt1);
    // alert(prompt2);
  },
  reset() {
    set({ ...resetState() });
  },
  setRetryState(flag) {
    set({
      retryState: flag
    });
  },
  selectRole(payload) {
    const { selectedRoleIndex, ip } = get();
    const role = {
      ...payload,
      ip
    };

    // 切换角色时清空推荐值
    if (selectedRoleIndex === 0) {
      set({ role1: role, currentRole: role, cachePrompts: {} });
    }
    if (selectedRoleIndex === 1) {
      set({ role2: role, currentRole: role, cachePrompts: {} });
    }
  },
  setRoleType(index) {
    const { role1, role2 } = get();
    // alert(index);
    set({
      selectedRoleIndex: index,
      currentRole: index === 0 ? role1 : role2
    });
  },
  changePageState(pageState) {
    const currentPageState = get().pageState;
    if (
      currentPageState &&
      currentPageState !== PageState.roleselect &&
      pageState === PageState.roleselect
    ) {
      set({ isSwitch: true });
    }
    set({
      pageState
    });
  },
  setCurrentSlot(payload) {
    set({
      currentSlot: payload
    });
  },
  getConfig() {
    return GetClientConfig();
  },
  setSelectedElements(item) {
    const {
      selectedElements,
      selectedElements2,
      selectedRoleIndex,
      promptGenerateType
    } = get();
    if (promptGenerateType === 1) {
      set({
        promptGenerateType: 2
      });
    }
    if (selectedRoleIndex === 0) {
      set({
        selectedElements: {
          ...selectedElements,
          ...item
        }
      });
    } else {
      set({
        selectedElements2: {
          ...selectedElements2,
          ...item
        }
      });
    }
  },
  changeBottomInputShow(visible, type, text?: string) {
    console.log('changeBottomInputShow------', visible, type);
    set({
      inputVisible: visible
    });

    if (type) {
      set({
        inputType: type
      });
    }

    if (visible) {
      if (text) {
        set({
          defaultInputText: text
        });
      }
    } else {
      set({
        defaultInputText: ''
      });
    }
  },
  getPrompt(type) {
    const role = {
      brandType: get().ip,
      role: get().currentRole?.id
    };

    const cachePrompts = get().cachePrompts;
    return GenFeaturePrompt({
      role,
      feature: type,
      excludePrompts: cachePrompts[type] || []
    }).then((res: GenFeaturePromptResponse) => {
      const { prompt } = res;
      const newPrompts = parsePrompts<PromptType>(prompt)[type];
      // const { addition } = parsePrompts<PromptType>(prompt);
      set({
        cachePrompts: {
          ...cachePrompts,
          [type]: (cachePrompts[type] || []).concat(newPrompts || [])
        }
      });
      return newPrompts || [];
    });
  },
  updateAdditionPrompts(text: string, remove?: string) {
    const { additionPrompts, additionPromptKey } = get().getCurrentPrompts();
    if (remove) {
      if (remove === text) return;
      const index = additionPrompts.findIndex(i => i === remove);
      if (index > -1) {
        const newVal = replace(additionPrompts, index, text);
        set({ [additionPromptKey]: newVal });
        return;
      }
    }
    set({ [additionPromptKey]: [text].concat(additionPrompts) });
  },
  addPrompt(type, item) {
    if (type === PromptType.addition) {
      get().updateAdditionPrompts(item.text, item.remove);
    } else {
      const { presetPrompts, presetPromptsKey } = get().getCurrentPrompts();
      console.log('addPrompt------', type, item);
      set({
        [presetPromptsKey]: { ...presetPrompts, [type]: item }
      });
    }

    const cachePrompts = get().cachePrompts;
    let promptType: string = item.type;
    if (promptType === 'custom') {
      if (cachePrompts[type]?.includes(item.text)) {
        promptType = 'rec';
      }
    }

    reportClick('prompt_typein', {
      cateType: type,
      text: item.text,
      promptType: promptType
    });
  },
  removePrompt(type, text) {
    const {
      additionPrompts,
      additionPromptKey,
      presetPromptsKey,
      presetPrompts,
      selectedElements,
      selectedElementsKey
    } = get().getCurrentPrompts();
    // const {
    //   additionPrompts,
    //   presetPrompts,
    //   additionPrompts2,
    //   presetPrompts2,
    //   selectedRoleIndex
    // } = get();
    if (type === PromptType.addition) {
      const newArr = additionPrompts.filter(i => i !== text);
      set({ [additionPromptKey]: newArr });
    } else {
      set({
        [presetPromptsKey]: omit(presetPrompts, [type]),
        [selectedElementsKey]: omit(selectedElements, [type])
      });
    }
  },
  resetTakePhoto() {
    set({ photos: [] });
  },
  takePhoto(extraInfo) {
    const {
      role1,
      role2,
      style,
      additionPrompts,
      additionPrompts2,
      presetPrompts,
      presetPrompts2,
      getRoles
    } = get();
    const arr = additionPrompts
      .map(i => `<addition:${i}>`)
      .concat(
        [
          PromptType.action,
          PromptType.expression,
          PromptType.cloth,
          PromptType.scene
        ].map(i => (presetPrompts[i] ? `<${i}:${presetPrompts[i]?.text}>` : ''))
      );
    let prompt = arr.filter(i => i).join(',');
    const roles = getRoles();

    if (role2) {
      const arr2 = additionPrompts2
        .map(i => `<addition:${i}>`)
        .concat(
          [
            PromptType.action,
            PromptType.expression,
            PromptType.cloth,
            PromptType.scene
          ].map(i =>
            presetPrompts2[i] ? `<${i}:${presetPrompts2[i]?.text}>` : ''
          )
        );
      prompt += ';' + arr2.filter(i => i).join(',');
    }

    let resolved = 0;
    let rejected = 0;

    set({ photoLoading: true, photos: [] });
    let firstPhoto: PartialMessage<PhotoProgress> | null = null;
    reportTimeStart('takephoto_start-expo');
    reportTimeStart('takephoto_end-expo');

    const $pendingPhoto = new Promise((resolve, reject) => {
      TakePhoto(
        {
          params: {
            roles: roles,
            style,
            size: '1792*2304',
            prompt,
            photos: 3
          },
          referenceCardId: get().referenceCardId,
          referenceProtoId: get().referenceProtoId,
          pt: {
            page: getPageID()
          },
          it: extraInfo?.invokeType
        },
        data => {
          if (!data.task) {
            // reject(new ErrorRes({ code: 1, reason: '请求出错' }));
            return;
          }
          const { state, progess } = data.task;
          if (state === PhotoTaskState.FINISHED) {
            set({
              photos: getFinishPhotos(firstPhoto, progess || []),
              photoLoading: false
            });

            reportExpo('takephoto_end', {
              photos: JSON.stringify(progess?.map(i => i.photoId))
            });
            if ((progess?.filter(i => i?.url)?.length || 0) < 3) {
              requestErrorLog('take_photo_error', progess);
            }
            return;
          }
          //ABORTED 中断
          if (state === PhotoTaskState.ABORTED) {
            logWarn('take photo err', JSON.stringify(data.task));
            if (!rejected) {
              reject(new ErrorRes({ code: 1, reason: '请求出错' }));
              rejected = 1;
              set({
                photoLoading: false
              });
            }
            return;
          }

          // todo 审核状态
          console.log(
            'TakePhoto-------',
            progess,
            // JSON.stringify(data.task?.progess[0]),
            state,
            data.task?.progess && data.task?.progess[0] && !resolved
          );
          if (data.task?.progess && data.task?.progess[0] && !resolved) {
            firstPhoto = data.task?.progess[0];
            // 获取积分总量

            if (extraInfo?.invokeType === InvokeType.INVOKE_DRAWING_REDO) {
              // 重炖这里加入一次策略更新，没有发生 UI 变化
              strategyUpdateHandle(InvokeType.INVOKE_DRAWING_REDO);
            } else {
              useCreditStore.getState().syncCredits();
            }

            set({
              photos: data.task?.progess
            });
            resolved = 1;
            reportExpo('takephoto_start', {
              photos: data.task?.progess[0]?.photoId
            });
            resolve(data.task?.progess[0]);
          }
          set({ makePhotoId: uuid(), promptGenerateType: 3 });
          // if (data.task?.progess && data.task?.progess.length === 3) {
          //   set({
          //     photoLoading: false
          //   });
          // }
        },
        async error => {
          console.log('TakePhoto-------err', error);
          // 边界更新 [TODO: 先兼容炖图失败回到生图的 type]
          extraInfo &&
            (await strategyUpdateHandle(InvokeType.INVOKE_DRAWING_GEN));

          if (!rejected) {
            reject(error);
            rejected = 1;
            set({
              photoLoading: false
            });
          }
        }
      );

      Socket.events.on(
        'disconnect',
        () => {
          console.log('disconnect-------', get().photoLoading, rejected);
          // alert(12334);
          // alert(get().photoLoading);
          // alert(rejected);
          if (get().photoLoading && !rejected) {
            rejected = 1;
            set({
              photoLoading: false
            });
            reject(new ErrorRes({ code: 1, reason: '炖图失败，请重试~' }));
          }
        },
        true
      );
    });

    set({ $pendingPhoto });
  },
  pendingTakePhoto() {
    // 炖出第一张图就返回
    return get().$pendingPhoto || Promise.reject({});
  },
  setStyle(style) {
    set({ style });
  },
  getRoles() {
    const { role1, role2 } = get();
    const roles: Role[] = [role1, role2]
      .map(i => {
        if (!i) return;
        return {
          // @ts-ignore
          brandType: mapIP[i.ip] || i.ip,
          role: i.id
        };
      })
      .filter((item): item is Role => typeof item === 'object');

    return roles;
  },
  autoPrompts() {
    const roles = get().getRoles();
    const { selectedRoleIndex } = get();
    return GenFeaturePrompts({
      roles
    }).then((res: GenFeaturePromptResponse) => {
      const { addition, ...others } = parsePrompts<PromptType>(res.prompt);
      const presetPrompts = getPresetPrompts(others);
      Haptics.notificationAsync();
      if (selectedRoleIndex === 0) {
        // config options
        set({
          additionPrompts: addition?.slice(0, 5),
          // @ts-ignore todo
          presetPrompts,
          // @ts-ignore todo
          selectedElements: getSelectedElements(others)
        });
      } else {
        // config options
        set({
          additionPrompts2: addition?.slice(0, 5),
          // @ts-ignore todo
          presetPrompts2: presetPrompts,
          // @ts-ignore todo
          selectedElements2: getSelectedElements(others)
        });
      }

      // 上报大乱炖结果
      reportClick('ai_prompt_image_generate_res', { prompt: res.prompt });
      return res;
    });
  },
  deleteCurrentRole() {
    // 删除当前角色
    const {
      selectedRoleIndex,
      role1,
      role2,
      selectedElements,
      selectedElements2,
      additionPrompts,
      additionPrompts2,
      presetPrompts,
      presetPrompts2
    } = get();

    if (selectedRoleIndex === 1) {
      reportClick('delete_role', { role: role2?.id });

      set({
        selectedRoleIndex: 0,
        role2: null,
        selectedElements2: {},
        presetPrompts2: {},
        additionPrompts2: [],
        currentRole: role1
      });
    } else {
      reportClick('delete_role', { role: role1?.id });

      set({
        selectedRoleIndex: 0,
        role1: role2,
        selectedElements: selectedElements2,
        presetPrompts: presetPrompts2,
        additionPrompts: additionPrompts2,
        selectedElements2: {},
        presetPrompts2: {},
        additionPrompts2: [],
        role2: null,
        currentRole: role2
      });
    }
  },
  getCurrentPrompts() {
    const {
      selectedRoleIndex,
      additionPrompts,
      additionPrompts2,
      presetPrompts,
      presetPrompts2,
      selectedElements,
      selectedElements2
    } = get();
    if (selectedRoleIndex === 0) {
      return {
        additionPrompts,
        presetPrompts,
        selectedElements,
        additionPromptKey: 'additionPrompts',
        presetPromptsKey: 'presetPrompts',
        selectedElementsKey: 'selectedElements'
      };
    }
    return {
      additionPrompts: additionPrompts2,
      presetPrompts: presetPrompts2,
      selectedElements: selectedElements2,
      additionPromptKey: 'additionPrompts2',
      presetPromptsKey: 'presetPrompts2',
      selectedElementsKey: 'selectedElements2'
    };
  }
}));

function getPresetPrompts(payload: PromptsArrType<PromptType>) {
  return Object.keys(payload).reduce(
    // @ts-ignore todo
    (result: PresetPromptsType, key: PromptType) => {
      const valArr = payload[key];
      if (!valArr || !valArr[0]) return result;
      const val = valArr[0];
      console.log('getPresetPrompts', val, key);
      const presetVals = options[key].options.map(key => config[key].text);
      const isPreset = presetVals.includes(val);
      const type = isPreset ? 'preset' : 'custom';
      result[key] = { type, text: val };
      return result;
    },
    {}
  );
}

function getSelectedElements(payload: PromptsArrType<PromptType>) {
  return Object.keys(payload).reduce(
    // @ts-ignore todo
    (result: SelectedItemType, key: PromptType) => {
      const valArr = payload[key];
      if (!valArr || !valArr[0]) return result;
      const val = valArr[0];
      const presetKey = options[key].options.find(key => {
        return config[key].text === val;
      });
      if (presetKey) {
        // @ts-ignore todo
        result[key] = {
          type: key,
          id: config[presetKey].id,
          position: { x: -100, y: -100 }
        };
      } else {
        // @ts-ignore todo
        result[key] = {
          type: key,
          id: 'custom',
          position: { x: -100, y: -100 }
        };
      }
      return result;
    },
    {}
  );
}

function getFinishPhotos(
  firstItem: PartialMessage<PhotoProgress> | null,
  allData: PartialMessage<PhotoProgress>[]
): PartialMessage<PhotoProgress>[] {
  const errorItems: PartialMessage<PhotoProgress>[] = [];
  const photos: PartialMessage<PhotoProgress>[] = [];

  console.log('allData', allData);
  let firstBlock = 0;
  allData.forEach(item => {
    if (firstItem && item && item.photoId === firstItem.photoId) {
      if (item.cencorState === CensoredState.CENSORED_BLOCKED) {
        firstBlock = 1;
        errorItems.push(item);
      }
      return;
    }
    if (!item) return;
    if (item.cencorState !== CensoredState.CENSORED_BLOCKED) {
      photos.push(item);
    } else {
      errorItems.push(item);
    }
  });
  return firstItem && !firstBlock
    ? [firstItem].concat(photos).concat(errorItems)
    : photos.concat(errorItems);
}
