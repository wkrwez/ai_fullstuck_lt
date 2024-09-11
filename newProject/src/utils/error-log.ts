// import { APIEnvConst } from '@step.ai/connect-api-common';
import { lipuAPIEnv } from '../api/env';
import { reportErrorEvent, reportJSError } from '@step.ai/event-monitor';
import { logWarn as nativeLogWarn } from '@step.ai/logging-module';
import { getPage, getPageID } from './report';

function errorToString(error: unknown): string {
  if (error instanceof Error) {
    // 如果错误是 Error 类型，返回错误消息
    return error.message;
  } else if (error === null || error === undefined) {
    // 如果错误是 null 或 undefined，返回空字符串
    return '';
  } else if (typeof error === 'object') {
    // 否则，返回一个默认的字符串
    return JSON.stringify(error);
  } else if (typeof error === 'string') {
    return error;
  }
  return '';
}

// 异常类型定义
export enum ReportError {
  manual = 'RN.manual',
  socket = 'Socket',
  request = 'RN.request',
  error = 'RN.error',
  load = 'RN.load',
  waterfall = 'RN.waterfall' // 信息流
}

type ReportErrorType = 'RN.manual' | 'Socket' | 'RN.waterfall';

/** 上报异常 */
export function logWarn(
  message: string,
  error: unknown,
  tag: ReportErrorType | ReportError = ReportError.manual,
  isFatal: boolean = false,
  params?: unknown
) {
  try {
    const errorString = errorToString(error);
    const logMessage = `[${message}] ${errorString}`;
    const logTag = tag.startsWith('RN') ? tag : `RN.${tag}`;

    // 写入本地日志供回捞
    nativeLogWarn(logMessage, logTag);

    const defaultParams = {
      page: getPage(),
      pageID: getPageID()
    };

    const realParams = {
      ...defaultParams,
      ...(params || {})
    };

    // 上报供监控告警
    if (error instanceof Error) {
      reportJSError(error, message, isFatal, logTag, realParams);
    } else {
      reportErrorEvent({
        type: logTag,
        title: message,
        subtitle: errorString,
        isFatal: isFatal,
        params: { params: errorToString(realParams) }
      });
    }
  } catch (error) {}
}

export function requestErrorLog(
  message: string,
  params?: unknown,
  payload?: {
    error?: unknown;
    isFatal?: boolean;
  }
) {
  logWarn(
    message || 'request-error',
    payload?.error,
    ReportError.request,
    payload?.isFatal || false,
    params
  );
}

export function catchErrorLog(
  message: string,
  error?: unknown,
  payload?: {
    params?: unknown;
    isFatal?: boolean;
  }
) {
  logWarn(
    message || 'catch-error',
    error,
    ReportError.error,
    payload?.isFatal || false,
    payload?.params
  );
}
