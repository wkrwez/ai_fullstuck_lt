import { Injectable } from '@nestjs/common'
import { BaseTask } from './base.task'

@Injectable()
export class ScriptTask extends BaseTask {
  readonly type = 'script'

  async execute(
    config: Record<string, any> | undefined,
    ctx: { data: any; log: (level: string, msg: string) => void },
  ) {
    const { code = '' } = config || {}

    if (!code.trim()) throw new Error('script 任务缺少 code 配置')

    ctx.log('info', '⚡ 执行自定义脚本…')

    const fn = new Function(
      'data',
      'ctx',
      'utils',
      `
      const { console, JSON, Math, Date, Promise, Array, Object, String, Number, Boolean } = utils;
      return (async () => {
        ${code}
      })();
      `,
    )

    const result = await fn(ctx.data, ctx, {
      console,
      JSON,
      Math,
      Date,
      Promise,
      Array,
      Object,
      String,
      Number,
      Boolean,
    })

    return result !== undefined ? result : null
  }
}
