import { lipuAPIEnv } from './api/env';

// layer index
export const SPALASH_ZINDEX = 1000;
export const DEFAULT_MODAL_ZINDEX = 1000;
export const DEFAULT_SHEET_ZINDEX = 1001;
export const LOGIN_SHEET_ZINDEX = 1100;

// size

export const SEC_HEIGHT = 44;

// image
export const ICON_IMAGE = require('@Assets/image/icon.png');
export const LOGO_TEXT = require('@Assets/image/text_logo.png');
export const IP_MASK = require('@Assets/image/feed/ip_mask.png');
export const IP_IMAGE_BACK = require('@Assets/image/feed/ip_image_back.png');
export const IP_IMAGE_FRONT = require('@Assets/image/feed/ip_image_front.png');
const LOGIN_TIT = require('@Assets/image/login/login_title_bg.png');
const LOGIN_TIT_COMMENT = require('@Assets/image/login/login_title_comment.png');
const LOGIN_TIT_LIKE = require('@Assets/image/login/login_title_like.png');
const LOGIN_TIT_FOLLOW = require('@Assets/image/login/login_title_follow.png');
const LOGIN_TIT_CREATE = require('@Assets/image/login/login_title_create.png');
const LOGIN_TIT_MESSAGE = require('@Assets/image/login/login_title_message.png');
const LOGIN_TIT_USER = require('@Assets/image/login/login_title_user.png');
const LOGIN_TIT_WISH = require('@Assets/image/login/login_title_wish.png');
const LOGIN_TIT_RESERVE = require('@Assets/image/login/login_title_reserve.png');

// placehoder

export const EMPTY_WORK = require('@Assets/image/placeholder/empty_work.png');

// IP

export const IP_GUIMIE = require('@Assets/image/feed/guimiezhiren.png');
export const IP_HUOYINGRENZHE = require('@Assets/image/feed/huoyingrenzhe.png');

// lottie
export const LOTTIE_TEXT_LOADING = require('@Assets/lottie/text_loading.json');

export const TAB_FOOTER_ICON = require('@Assets/image/feed/tab_highlight.png');

export const PHONE_REG = {
  // 放宽限制，只校验长度
  CN: /^1\d{10}$/, //1开头+10位数字
  TW: /^(\d{8,10})$/, // 8或10位数字
  MO: /^\d{8}$/, // 8位数字
  HK: /^\d{8}$/ // 8位数字
};

export type CountryAbbr = keyof typeof PHONE_REG;

export const CITY_CODE: Record<CountryAbbr, string> = {
  CN: '+86',
  HK: '+852',
  MO: '+853',
  TW: '+886'
};

export const CITY_NAME: Record<CountryAbbr, string> = {
  CN: '中国',
  HK: '中国香港',
  MO: '中国澳门',
  TW: '中国台湾'
};

export const SITE_URL =
  lipuAPIEnv.currentEnvType() === 'PROD'
    ? 'https://m.lipuhome.com'
    : 'https://test-raccoon-darkhorse-web.c.ibasemind.com';
// export const SITE_URL = 'https://m.lipuhome.com';

//进来的协议详情页
export const PRIVACY_URL = SITE_URL + '/legal/privacy';
export const AGREEMENT_URL = SITE_URL + '/legal/terms';

export const PRIVACY_SUMMARY_URL = SITE_URL + '/legal/privacy-summary';
export const CHILDREN_URL = SITE_URL + '/legal/children';
export const USER_MANAGEMENT_URL = SITE_URL + '/legal/user-management';
export const SDK_URL = SITE_URL + '/legal/third-party';
export const PERSONAL_INFORMATION_URL =
  SITE_URL + '/legal/personal-information';
export const REGISTERED_URL = 'https://beian.miit.gov.cn/';
export const ALGORITHUM_URL = 'https://beian.cac.gov.cn';

export const SHARE_DETAIL_URL = SITE_URL + '/detail';

export const LOGIN_SCENE = {
  COMMON: 'common',
  COMMENT: 'comment', // 评论
  LIKE: 'like', // 点赞
  FOLLOW: 'follow', // 关注
  TAKE_SAME_STYLE: 'takeSameStyle', // 拍同款
  TO_CREATE: 'toCreate', // 进入创作流程
  TO_MESSAGE: 'toMessage', // 进入消息页
  TO_USER: 'toUser', // 进入个人中心
  MAKE_WISH: 'makeWish', // 许愿
  RESERVE: 'reserve', // 预约
  FEED_HOLDER: 'feed-holder' // 运营
};

export const LOGIN_SCENE_REPORT = {
  [LOGIN_SCENE.COMMON]: '0',
  [LOGIN_SCENE.COMMENT]: '1',
  [LOGIN_SCENE.LIKE]: '2',
  [LOGIN_SCENE.FOLLOW]: '3',
  [LOGIN_SCENE.TAKE_SAME_STYLE]: '4',
  [LOGIN_SCENE.TO_CREATE]: '5',
  [LOGIN_SCENE.TO_MESSAGE]: '6',
  [LOGIN_SCENE.TO_USER]: '7',
  [LOGIN_SCENE.MAKE_WISH]: '8',
  [LOGIN_SCENE.RESERVE]: '9',
  [LOGIN_SCENE.FEED_HOLDER]: '10'
};

// export const LOGON_TIT_MAP = {
//   [LOGIN_SCENE.COMMON]: '登录后解锁全部功能哩~',
//   [LOGIN_SCENE.COMMENT]: '畅所欲言前请先登录！',
//   [LOGIN_SCENE.LIKE]: '登录后才能称赞别人奥～',
//   [LOGIN_SCENE.FOLLOW]: '请登录！不许悄悄关注！',
//   [LOGIN_SCENE.TAKE_SAME_STYLE]: '请登录！创组优秀作品必须留名～',
//   [LOGIN_SCENE.TO_CREATE]: '请登录！创作优秀作品必须留名～',
//   [LOGIN_SCENE.TO_MESSAGE]: '请登录！有身份才有消息奥～',
//   [LOGIN_SCENE.TO_USER]: '请登录！先让小狸知道你是谁！',
// }

export const LOGON_TIT_IMAGE_MAP = {
  [LOGIN_SCENE.COMMON]: LOGIN_TIT,
  [LOGIN_SCENE.COMMENT]: LOGIN_TIT_COMMENT,
  [LOGIN_SCENE.LIKE]: LOGIN_TIT_LIKE,
  [LOGIN_SCENE.FOLLOW]: LOGIN_TIT_FOLLOW,
  [LOGIN_SCENE.TAKE_SAME_STYLE]: LOGIN_TIT_CREATE,
  [LOGIN_SCENE.TO_CREATE]: LOGIN_TIT_CREATE,
  [LOGIN_SCENE.TO_MESSAGE]: LOGIN_TIT_MESSAGE,
  [LOGIN_SCENE.TO_USER]: LOGIN_TIT_USER,
  [LOGIN_SCENE.MAKE_WISH]: LOGIN_TIT_WISH,
  [LOGIN_SCENE.RESERVE]: LOGIN_TIT_RESERVE,
  [LOGIN_SCENE.FEED_HOLDER]: LOGIN_TIT
};

export const SHARE_WORLD_URL = SITE_URL + '/worldDetail';

// DEBUG CONFIG

// for calc default image ratio
export const DEFAULT_IMAGE_WIDTH = 704;
export const DEFAULT_IMAGE_HEIGHT = 936;

export const WEBVIEW_EVENTS = {
  LOGIN: 'LOGIN',
  TAKE_PHOTO: 'TAKE_PHOTO',
  ROUTER_PUSH: 'ROUTER_PUSH',
  ROUTER_REPLACE: 'ROUTER_REPLACE',
  SHARE_INFO_REGISTER: 'SHARE_INFO_REGISTER',
  ROUTER_BACK: 'ROUTER_BACK',
  WEBVIEW_INFO: 'WEBVIEW_INFO'
};
