// 配置存读 服务端拉取 本身静态配置 统一出口
// 捏图
import { create } from 'zustand';
import { ResourceClient } from '@/src/api/config';
import { GetClientConfig } from '@/src/api/makephoto';
import { RoleDataMap, RoleItemType } from '@/src/types';
import { catchErrorLog } from '@Utils/error-log';
import { Role } from '@/proto-registry/src/web/raccoon/makephoto/makephoto_pb';
import { PartialMessage } from '@bufbuild/protobuf';
import { useStorageStore } from './storage';

// 配置类型
enum ConfigType {
  makePhoto = 'makePhoto'
}

type PhotoStyles = {
  id: string;
  key?: string;
  url: string;
  tag: string;
  name: string;
  material?: string;
};

type IPItemType = {
  key: number;
  label: string;
  roles: RoleItemType[];

  // presets: getPresets({
  //   expression: item.expressions,
  //   action: item.actions,
  //   cloth: item.cloths,
  //   scene: item.scenes
  // })
};

type IPDataType = {
  [key in number]: IPItemType;
};

type MakePhotoConfig = {
  styles: PhotoStyles[];
  IPData: IPItemType[];
  IPMap: IPDataType;
};

export type PresetsItem = {
  name: string;
  id?: string;
  key?: string;
  list?: PresetsItem[];
};
export type PresetsType = {
  [key in string]: PresetsItem[];
};
type States = {
  makePhoto: MakePhotoConfig | null;
  roles: RoleItemType[] | null;
  roleMap: RoleDataMap | null;
  mode2: boolean;
  localResource: { [key in string]: unknown };
};

type Actions = {
  // todo 这部分要重构
  init: () => void;
  fetch: (key: ConfigType) => void;
  fetchMakePhotoConfig: () => Promise<any>;
  findRole: (role: PartialMessage<Role>) => RoleItemType | undefined;
  // 新接口
  getConfig: (resourceId: string, refresh?: boolean) => Promise<unknown>;
  getText: (key: string) => Promise<string>;
  updateConifg: (resourceId: string) => Promise<unknown>;
  setConfig: (resourceId: string, data: unknown) => void;
  // init: () => void
  // cleanUp: () => void
};

function getPresets(config: PresetsType) {
  return [
    {
      name: '表情',
      key: 'expression',
      list: config.expression
    },
    {
      name: '动作',
      key: 'action',
      list: config.action
    },
    {
      name: '服饰',
      key: 'cloth',
      list: config.cloth
    },
    {
      name: '场景',
      key: 'scene',
      list: config.scene
    }
  ];
}

// todo map
const mapIP = {
  'Demon Slayer': 2001,
  2001: 2001,
  'Jujutsu Kaisen': 2002,
  2002: 2002
};

const mockStyles = [
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/style/raw_pic.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/style/2.5d.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/style/qi.png'
];
const mockRoles = [
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/roles/icon-role1.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/roles/icon-role2.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/roles/icon-role3.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/roles/icon-role4.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/roles/icon-role8.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/roles/icon-role5.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/roles/icon-role6.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/roles/icon-role9.png',
  'https://aigc-res.tos-cn-shanghai.volces.com/brand/roles/icon-role7.png'
];
export const useConfigStore = create<States & Actions>()((set, get) => ({
  makePhoto: null,
  roles: null,
  roleMap: null,
  mode2: true,
  localResource: {},
  init() {
    get().fetch(ConfigType.makePhoto);
    get().getConfig('1012');
  },
  fetch(key) {
    switch (key) {
      case ConfigType.makePhoto:
        get().fetchMakePhotoConfig();
    }
  },
  fetchMakePhotoConfig() {
    return GetClientConfig()
      .then(res => {
        const { ips, styles: serviceStyles, switches } = res;

        if (switches) {
          set({
            mode2: switches?.mode_2
          });
        }

        const styles = serviceStyles.map((item: PhotoStyles, index: number) => {
          return {
            ...item,
            key: item.id,
            url: item.material || mockStyles[index]
          };
        });

        // @ts-ignore
        const currentIPData = ips.map(item => ({
          // @ts-ignore
          key: mapIP[item.id] || item.id,
          label: item.name,
          roles: item.roles.map((role: RoleItemType, index: number) => {
            const { id, name } = role;
            return {
              id,
              key: id,
              icon: role.material || mockRoles[index],
              name,
              ip: item.id
            };
          }),
          presets: getPresets({
            expression: item.expressions,
            action: item.actions,
            cloth: item.cloths,
            scene: item.scenes
          })
        }));

        const allRoles = currentIPData.reduce(
          (result: RoleItemType[], item: { roles: RoleItemType[] }) => {
            return result.concat(item.roles);
          },
          []
        );

        // @ts-ignore
        const IPMap = currentIPData.reduce((result, item) => {
          result[item.key] = item;
          return result;
        }, {});

        const roleMap = allRoles.reduce(
          (result: RoleDataMap, item: RoleItemType) => {
            result[item.id] = item;
            return result;
          },
          {}
        );

        set({
          makePhoto: {
            styles,
            IPData: currentIPData,
            IPMap
            // currentIPData
          },
          roles: allRoles,
          roleMap
        });
        return res;
      })
      .catch(e => {
        console.log('[GetClientConfig error]', e);
      });
  },
  findRole(role) {
    console.log('findRole-----', JSON.stringify(get().roles));
    return role && get().roles?.find(item => item.id === role.role);
  },
  getConfig(resourceId, refresh) {
    const cache =
      get().localResource[resourceId] ||
      useStorageStore.getState().resourceCache[resourceId];
    if (cache) {
      if (refresh) {
        get().updateConifg(resourceId);
      }
      return Promise.resolve(cache);
    }
    return get().updateConifg(resourceId);
  },
  async getText(key) {
    const texts = await get().getConfig('1012');
    const textObj = texts as { [key in string]: string };
    return textObj[key] || '';
  },
  setConfig(resourceId, data) {
    const cache = useStorageStore.getState().resourceCache;
    const newCache = { ...cache, [resourceId]: data };
    set({
      localResource: newCache
    });
    useStorageStore.getState().__setStorage({
      resourceCache: newCache
    });
  },
  async updateConifg(resourceId) {
    let result = [];

    try {
      const res = await ResourceClient.getResourceMaterial({
        resourceId
      });

      result = JSON.parse(res.materialList[0].content);
      get().setConfig(resourceId, result);
    } catch (e) {
      catchErrorLog('config update err', e, { params: { resourceId } });
    }
    return result;
  }
}));
