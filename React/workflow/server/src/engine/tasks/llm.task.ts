import { Injectable } from '@nestjs/common'
import { BaseTask } from './base.task'

/**
 * LlmTask — 大模型调用节点
 *
 * 调用 DeepSeek API（OpenAI 兼容接口）完成 AI 文本生成。
 * API Key 从服务端环境变量 DEEPSEEK_API_KEY 读取。
 */
@Injectable()
export class LlmTask extends BaseTask {
  readonly type = 'llm'

  async execute(
    config: Record<string, any> | undefined,
    ctx: { data: any; log: (level: string, msg: string) => void },
  ) {
    const {
      model = 'deepseek-chat',
      systemPrompt = '',
      userPrompt = '',
      temperature = 0.7,
      maxTokens = 2048,
      inputMapping,
    } = config || {}

    if (!userPrompt.trim()) {
      throw new Error('大模型任务缺少 userPrompt 配置')
    }

    // 1) 解析 inputMapping
    if (Array.isArray(inputMapping) && inputMapping.length > 0) {
      for (const mapping of inputMapping) {
        const varName = mapping.key?.trim?.() ?? mapping.key
        const sourcePath = mapping.value?.trim?.() ?? mapping.value
        if (!varName || !sourcePath) continue

        let resolved: any = undefined
        if (sourcePath === 'data') {
          resolved = ctx.data
        } else {
          const parts = sourcePath.split('.')
          let value: any = ctx.data
          for (const p of parts) {
            if (value == null) break
            value = value[p]
          }
          resolved = value
        }

        ctx.data[varName] = resolved
      }
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      throw new Error('缺少 DEEPSEEK_API_KEY 环境变量，请在 server/.env 中配置')
    }

    ctx.log('info', `🤖 调用大模型 [${model}]…`)

    // 插值替换 userPrompt 中的 {{xxx}} 占位符
    const resolvedUserPrompt = this.interpolate(userPrompt, ctx.data)
    const resolvedSystemPrompt = systemPrompt
      ? this.interpolate(systemPrompt, ctx.data)
      : ''

    const messages: Array<{ role: string; content: string }> = []
    if (resolvedSystemPrompt) {
      messages.push({ role: 'system', content: resolvedSystemPrompt })
    }
    messages.push({ role: 'user', content: resolvedUserPrompt })

    const body = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }

    ctx.log('info', `→ POST https://api.deepseek.com/v1/chat/completions`)
    const startedAt = Date.now()

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const elapsed = Date.now() - startedAt
    const responseBody = await response.text()

    if (!response.ok) {
      ctx.log('error', `← ${response.status} ${responseBody}`)
      throw new Error(`DeepSeek API 调用失败 (${response.status}): ${responseBody}`)
    }

    const parsed = JSON.parse(responseBody)
    const content = parsed.choices?.[0]?.message?.content ?? ''
    const usage = parsed.usage ?? {}

    ctx.log(
      'info',
      `← ${response.status} (${elapsed}ms) tokens: prompt=${usage.prompt_tokens}, completion=${usage.completion_tokens}`,
    )

    return {
      content,
      model: parsed.model,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      },
      elapsed,
    }
  }

  /**
   * Simple mustache-style interpolation: replaces {{key}} with ctx data values.
   * Supports nested paths like {{user.name}}.
   */
  private interpolate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(.+?)\}\}/g, (_match, path: string) => {
      const trimmed = path.trim()

      // {{data}} → whole context
      if (trimmed === 'data') {
        return JSON.stringify(data, null, 2)
      }

      // Navigate nested keys: "user.name" → data.user.name
      const keys = trimmed.split('.')
      let value: any = data
      for (const key of keys) {
        if (value == null) break
        value = value[key]
      }

      if (value === undefined || value === null) return ''
      return typeof value === 'string' ? value : JSON.stringify(value)
    })
  }
}
