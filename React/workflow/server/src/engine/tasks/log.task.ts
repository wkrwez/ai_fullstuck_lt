import { Injectable } from '@nestjs/common'
import { BaseTask } from './base.task'

@Injectable()
export class LogTask extends BaseTask {
  readonly type = 'log'

  async execute(
    config: Record<string, any> | undefined,
    ctx: { data: any; log: (level: string, msg: string) => void },
  ) {
    const { level = 'info', message = '' } = config || {}

    const resolved = String(message).replace(
      /\{\{(.+?)\}\}/g,
      (_, key: string) => {
        const trimmed = key.trim()
        return trimmed in ctx.data
          ? JSON.stringify(ctx.data[trimmed])
          : `{{${trimmed}}}`
      },
    )

    ctx.log(level, `📝 ${resolved}`)
    console.log(`[workflow:log] [${level.toUpperCase()}] ${resolved}`)

    return { level, message: resolved }
  }
}
