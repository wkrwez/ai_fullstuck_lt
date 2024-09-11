import { showToast } from '@/src/components';

export enum REVIEW_ERR_ENUM {
  WORLD_CREATE = 'WORLD_CREATE',
  PLOT_CHANGE = 'PLOT_CHANGE',
  IMG_DESC = 'IMG_DESC',
  TITLE = 'TITLE',
  COMMENT = 'COMMENT'
}

export type ReviewErrorMap = { [k in REVIEW_ERR_ENUM]: string };
const reviewErrorMap: ReviewErrorMap = {
  // 输入自己的世界线,
  [REVIEW_ERR_ENUM.WORLD_CREATE]: '世界崩塌，请文明用语',
  // 修改剧情
  [REVIEW_ERR_ENUM.PLOT_CHANGE]: '剧情不太行，再调整一下！',
  // 修改生图描述
  [REVIEW_ERR_ENUM.IMG_DESC]: '好词才能生好图，请改改',
  // 标题
  [REVIEW_ERR_ENUM.TITLE]: '标题就是脸面，再调整一下！',
  // 评论
  [REVIEW_ERR_ENUM.COMMENT]: '在别人的世界里要注意言辞奥'
};

export const errMsgs: { [key: number]: string | typeof reviewErrorMap } = {
  // '服务端异常',
  10006: '小狸发呆了，请重试',
  // '参数错误',
  10004: '小狸发呆了，请重试',
  // '重复请求',
  10009: '让小狸思考一会儿，请稍后重试',
  // '审核异常',
  10005: reviewErrorMap,
  // '作品消失啦'
  10002: '作品消失啦'
};

type ErrMsgs = typeof errMsgs;

// {"code": 351, "reason": "type:framework, code:351, msg:stream is already closed, caused by type:callee framework, code:10009, msg:lock fail"}

interface ErrorResponse {
  code: number;
  reason: string;
}

export interface ErrInfo {
  code: number;
  msg: ErrMsgs;
}

export const getErrInfo = (errorResponse: ErrorResponse): ErrInfo | void => {
  const match = errorResponse.reason.match(/code:(\d{5}), msg:([^,]+)/);
  if (match) {
    const errorCode = parseInt(match[1], 10);
    const errorMessage = errMsgs[errorCode];
    return { code: errorCode, msg: errorMessage };
  }
};

export const showErr = (e: ErrInfo, reviewType: REVIEW_ERR_ENUM) => {
  const err = getErrInfo(e);
  console.log('err-------->', err);

  if (err) {
    if (err.code === 10005 && reviewType) {
      showToast((err?.msg as ReviewErrorMap)[reviewType] ?? '出错了！');
    } else {
      showToast((err?.msg as string) ?? '出错了！');
    }
  }
};

// 报错格式可能不一样
interface ToastErr {
  code: number;
  reason: string;
}
export const toastErr = (err: ToastErr, reviewType: REVIEW_ERR_ENUM) => {
  if (err) {
    if (err.code === 10005 && reviewType) {
      showToast(
        (errMsgs[err?.code] as ReviewErrorMap)[reviewType] ?? '出错了！'
      );
    } else {
      showToast((errMsgs[err?.code] as string) ?? '出错了！');
    }
  }
};
