import { Controller, Post, Body } from '@nestjs/common'

/**
 * LLM Controller — 前端通过此代理接口调用大模型，API Key 仅存于服务端。
 */
@Controller('llm')
export class LlmController {
  @Post('chat')
  async chat(
    @Body()
    body: {
      model?: string
      messages: Array<{ role: string; content: string }>
      temperature?: number
      maxTokens?: number
    },
  ) {
    const {
      model = 'deepseek-chat',
      messages,
      temperature = 0.7,
      maxTokens = 2048,
    } = body

    if (!messages || messages.length === 0) {
      return { success: false, data: null, error: 'messages 不能为空' }
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return {
        success: false,
        data: null,
        error: '缺少 DEEPSEEK_API_KEY 环境变量',
      }
    }

    const startedAt = Date.now()
    const response = await fetch(
      'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      },
    )

    const elapsed = Date.now() - startedAt
    const responseBody = await response.text()

    if (!response.ok) {
      console.error(`[llm] DeepSeek API error (${response.status}): ${responseBody}`)
      return {
        success: false,
        data: null,
        error: `DeepSeek API 调用失败 (${response.status})`,
      }
    }

    const parsed = JSON.parse(responseBody)
    const content = parsed.choices?.[0]?.message?.content ?? ''

    return {
      success: true,
      data: {
        content,
        model: parsed.model,
        usage: {
          promptTokens: parsed.usage?.prompt_tokens,
          completionTokens: parsed.usage?.completion_tokens,
          totalTokens: parsed.usage?.total_tokens,
        },
        elapsed,
      },
    }
  }
}
