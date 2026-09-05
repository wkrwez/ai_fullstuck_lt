import { Injectable } from '@nestjs/common'
import { BaseTask } from './base.task'

@Injectable()
export class DelayTask extends BaseTask {
  readonly type = 'delay'

  async execute(
    config: Record<string, any> | undefined,
    ctx: { data: any; log: (level: string, msg: string) => void },
  ) {
    const { duration = 1000 } = config || {}
    const ms = Math.min(Math.max(Number(duration) || 1000, 0), 300_000)

    ctx.log('info', `⏱️ 等待 ${ms}ms…`)
    await new Promise((resolve) => setTimeout(resolve, ms))

    return { waited: ms }
  }
}
