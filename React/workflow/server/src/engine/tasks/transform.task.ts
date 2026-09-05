import { Injectable } from '@nestjs/common'
import { BaseTask } from './base.task'

@Injectable()
export class TransformTask extends BaseTask {
  readonly type = 'transform'

  async execute(
    config: Record<string, any> | undefined,
    ctx: { data: any; log: (level: string, msg: string) => void },
  ) {
    const { operation, fields, key, value, expression } = config || {}

    ctx.log('info', `🔄 transform → ${operation || 'set'}`)

    switch (operation) {
      case 'pick': {
        if (!Array.isArray(fields))
          throw new Error('pick 操作需要 fields 数组')
        const picked: Record<string, any> = {}
        for (const f of fields) {
          if (f in ctx.data) picked[f] = ctx.data[f]
        }
        ctx.data = picked
        return picked
      }

      case 'set': {
        const resolved = typeof value === 'function' ? value(ctx) : value
        if (key) ctx.data[key] = resolved
        return { [key]: resolved }
      }

      case 'map': {
        if (!expression) throw new Error('map 操作需要 expression 配置')
        const fn = new Function('data', 'ctx', `return (${expression})`)
        ctx.data = fn(ctx.data, ctx)
        return ctx.data
      }

      default:
        throw new Error(`不支持的 transform 操作: ${operation}`)
    }
  }
}
