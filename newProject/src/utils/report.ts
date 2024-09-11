import { Platform } from 'react-native';
import { uuid } from '@Utils/uuid';
import { lipuAPIEnv } from '../api/env';
import { Socket } from '../api/websocket';
import { createEventSender } from '@step.ai/insight-tracker-module';

// todo 暂时先这么写，整体要重构一下

const pureSendBizEvent = createEventSender<any>();

let currentPage = '';
let pageID = '';
let lastPage = '';
let lastPageID = '';
let globalParams = {};

type RecordTimeType = {
  [key in string]: number;
};

type CommonParams = {
  [key in string]: string | number;
};

const recordTime: RecordTimeType = {};
const commonParams: { [key in string]: CommonParams } = {};
const sourceParams: { [key in string]: CommonParams } = {};

type PageMapType = {
  [key in string]: string;
};

export enum Source {
  // 首页玩法入口
  HOME_ENTRY = 'home_entry',
  // 拍同款
  DRAWING_WITH_PROMPT = 'drawing_same_prompt',
  // 拍摄角色
  DRAWING_WITH_CHARACTER = 'drawing_same_character'
}

// 定义模块名
export type MODULE_TYPE = 'login' | 'push' | 'app';

const pageMap: PageMapType = {
  '/feed': 'feed',
  '/': 'feed',
  '': 'feed',
  '/setting': 'setting',
  '/create': 'create',
  '/make-photo': 'create',
  '/message': 'message',
  '/name': 'name',
  '/setting/account': 'account',
  '/setting/about': 'about',
  '/webview': 'webview',
  '/follow-fan': 'followfan',
  '/publish': 'publish',
  '/ip/*': 'ipfeed',
  '/user/*': 'user',
  '/detail/*': 'detail',
  '/topic/world/*': 'worldtopic',
  '/topic/*': 'topic',
  '/parallel-world/center': 'worldallscript',
  '/parallel-world/*': 'world',
  '/emoji/recreate/*': 'emoji_preview',
  '/emoji/create': 'emoji_creation',
  '/search': 'search',
  '/search/result': 'search',
  '/search/prefer': 'search',
  '/credit': 'credit'
};

export const setPageName = (pageName: string) => {
  lastPage = currentPage;
  lastPageID = pageID;
  if (pageMap[pageName]) {
    lastPage = currentPage;
    currentPage = pageMap[pageName];
  } else {
    const newPage = pageName.split('/').slice(0, -1).concat('*').join('/');
    currentPage = pageMap[newPage] || pageName;
  }

  pageID = uuid();
};

export const setGlobalParams = (params: any) => {
  const invokeParams = Object.keys(params || {}).reduce((result, key) => {
    if (key === 'tracking_data') {
      result['invoke_source'] = 'push';
    }
    if (/^invoke_/.test(key)) {
      result[key] = params[key];
    }

    return result;
  }, {} as any);
  globalParams = { ...globalParams, ...(invokeParams || {}) };
};

export const getGlobalParams = () => globalParams;

export const getPageName = () => currentPage;

export const sendBizEvent = (name: string, params: any = {}) => {
  if (!params.client) {
    params.client = Platform.OS;
  }
  if (!params.env) {
    params.env = lipuAPIEnv.currentEnvType() || 'DEV';
  }

  // 页面公参
  params = { ...params, ...globalParams };

  // 上报时间
  if (recordTime[name]) {
    params.duration = Date.now() - recordTime[name];
    delete recordTime[name];
  }

  // 页面访问唯一ID
  if (pageID) {
    params.page_visit_id = pageID;
  }

  // 当前页面
  if (currentPage) {
    params.current_page = currentPage;
  }

  // 上一个页面
  if (lastPage) {
    params.from_page = lastPage;
  }

  // 上一个页面的id
  if (lastPageID) {
    params.last_page_visit_id = lastPageID;
  }
  // 上报页面公参
  const pageName = (params.page || name || '').split('-')[0];
  if (commonParams[pageName]) {
    params = { ...params, ...commonParams[pageName] };
  }

  // 上报source参数
  if (params.sourceid && sourceParams[params.sourceid]) {
    params = { ...params, ...sourceParams[params.sourceid] };
  }

  // @ts-ignore
  const safeParams = Object.keys(params).reduce((result, key) => {
    if (params[key] instanceof BigInt) {
      // @ts-ignore
      result[key] = params[key].toString();
      return result;
    }
    if (typeof params[key] === 'undefined' || params[key] === null) {
      return result;
    }
    // @ts-ignore
    result[key] = params[key];
    return result;
  }, {});
  // console.log('params------', lipuAPIEnv.currentEnvType(), params);
  console.log('report------', name, safeParams);
  pureSendBizEvent(name, safeParams);
};

const getReportPage = (params: { module?: MODULE_TYPE }) => {
  let moduleName = currentPage;
  if (params?.module) {
    moduleName = params?.module;
  }
  return moduleName;
};
export const reportExpo = (
  element: string,
  params?: any,
  type?: string | boolean,
  type2?: string
) => {
  if (typeof type === 'boolean') {
    // 延迟上报
    setTimeout(() => {
      const name = `${getReportPage(params)}-${element}-${type2 || 'expo'}`;
      sendBizEvent(name, params || {});
    });
    return;
  }

  const name = `${getReportPage(params)}-${element}-${type || 'expo'}`;
  console.log(name, 'namename1');
  sendBizEvent(name, params || {});
};

export const reportClick = (element: string, params?: any, type?: string) => {
  const name = `${getReportPage(params)}-${element}-${type || 'click'}`;
  console.log(name, 'namename');
  sendBizEvent(name, params || {});
};

// 记录时间 公参:duration
export const reportTimeStart = (event: string) => {
  const name = `${currentPage}-${event}`;
  recordTime[name] = Date.now();
};

export const getPageID = () => pageID;

export const getPage = () => currentPage;

export const addCommonReportParams = (
  pageName: string,
  params: CommonParams
) => {
  commonParams[pageName] = { ...(commonParams[pageName] || {}), ...params };
};

export const clearCommonReportParams = (pageName: string) => {
  delete commonParams[pageName];
};

// WIP
export const recordSourceParams = (sourceid: string, params: CommonParams) => {
  sourceParams[sourceid] = { ...(sourceParams[sourceid] || {}), ...params };
};

// todo 不合理 要去掉
export const reportPage = (element: string, params?: any, type?: string) => {
  const name = `${currentPage}-${element}`;
  sendBizEvent(name, params || {});
};

// todo 要去掉
export const reportMakePhotoTrack = (
  eventName: string,
  pageState: string,
  elementSuffix: string,
  params?: { [key in string]: string | number }
) => {
  const page = `${pageMap['/make-photo']}-${pageState}`;
  const name = `${page}-${eventName}`;
  sendBizEvent(name, {
    ...params,
    page,
    element: `${page}-${elementSuffix}`
  });
};

// todo 不太合理，不应该自定义页面
export const reportDiy = (
  page: string,
  element: string,
  params?: any,
  type?: string
) => {
  const name = `${page}-${element}`;
  sendBizEvent(name, params || {});
};
