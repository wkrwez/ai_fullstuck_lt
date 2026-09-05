import { Injectable } from '@nestjs/common'
import { BaseTask } from './base.task'

@Injectable()
export class HttpRequestTask extends BaseTask {
  readonly type = 'http-request'

  async execute(
    config: Record<string, any> | undefined,
    ctx: { data: any; log: (level: string, msg: string) => void },
  ) {
    const { method = 'GET', url, headers = {}, body } = config || {}

    if (!url) throw new Error('HTTP 请求任务缺少 url 配置')

    ctx.log('info', `→ ${method} ${url}`)

    const fetchOptions: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
    }
    if (body && method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    const startedAt = Date.now()
    const response = await fetch(url, fetchOptions)
    const elapsed = Date.now() - startedAt

    const responseBody = await response.text()
    let parsed: any
    try {
      parsed = JSON.parse(responseBody)
    } catch {
      parsed = responseBody
    }

    ctx.log('info', `← ${response.status} (${elapsed}ms)`)

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: parsed,
      elapsed,
    }
  }
}
