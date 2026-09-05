# withStructuredOutput 约束的强大之处

1. 通过 Zod Schema，序列化为标准 JSON‑Schema，随请求参数一起传给大模型服务商接口。
2. 复用模型原生能力：JSON 模式 / Tool‑Calling 机制
   底层复用 Provider 的两套原生能力：
   - JSON Mode（JSON 模式）：告诉模型本次生成，输出内容必须严格是合法 JSON；
   - Tool Calling（工具调用）：借用工具调用的参数解析通道，强制输出符合 Schema 的结构化参数。
3. 服务商接口层会做校验，模型输出会被约束
4. 模型在推理生成阶段就受后端约束，从生成源头限制输出内容，而不是生成完再在本地代码做字符串截取清洗。

# JsonOutputParser 的问题

1. 单靠 Prompt 的约束无法让模型强制输出对应 JSON 格式，没有底层约束
2. 必须手动调用 parser.get_format_instructions()，把格式指令塞进 prompt。
3. 模型混合文本输出会报错。

# prompt 格式化

- 通过 ChatPromptTemplate.fromMessages([])
- ["placeholder", "{history}"], // 等价于 MessagesPlaceholder("history")

# Runnable

## RunnablePassthrough（顺序链）

RunnablePassthrough.assign(): 将输入参数与定义参数传递到下游，解决链式调用传递参数需要一次次返回的问题。

## RunnableParallel （并行链）

任意分支抛异常，直接失败

## RunnableLambda

把一个普通 JS/TS 函数（同步 or async）包装成一个 Runnable，能够接入 pipe / RunnableSequence / RunnableParallel 整个流水线体系。

- 可以用来处理并行链报错

## RunnableBranch 条件分支

- 支持异步，但是需要等待执行完成。每条分支都会执行，直到为 true 或进入 default 分支。
- 适合少量、扁平、声明式的分支
- 分支过多可以通过 JS 函数（由 RunnableLambda 包装）

## Fallback

1.

```ts
const resilient = model.withRetry({
  stopAfterAttempt: 3,
  onFailedAttempt: (error, input) => {}, // 每次失败的回调
});
```

2. withFallbacks[]：降级到其他 Runnable

- 模型降级处理

```ts
const model = new ChatOpenAI({ model: "gpt-5" });
const result = model.withFallbacks([{
   new ChatOpenAI({ model: "gpt-4" }),
   new ChatOpenAI({ model: "gpt-3.5-turbo" }),
}]);
```

- 输出解析：放入一个Runnable的输出解析函数

# Memory

## short(短期记忆)

- 在模型中通过配置 checkpointer 实现
- 每次 invoke 结束自动把当前状态存下来（完整的消息数组），下次相同 （绑定）thread_id 调用时，自动加载历史消息，拼接到请求里。
- 缺点：内存存储，会话关闭记忆丢失，token 浪费、延迟升高、触发模型上下文窗口上限。

## Summary(摘要式记忆)

- summarizationMiddleware：可以让 [messages条数（token）] 与 [keep保留条数] 同时进行约束。压缩得摘要会以 system message 形式留在历史替换旧消息

- 流程： 消息达到阈值，切出最早得消息，使用轻量模型压缩成摘要，remove 旧消息，将摘要注入到 systemMessage ，摘要 + 最近得 N 条消息，调用主模型/写回 checkpointer

```ts
const agent = createAgent({
  model: "anthropic:claude-sonnet-4-6",
  tools: [],
  systemPrompt: "你是一个会记住用户信息的助手。",
  middleware: [summaryMiddleware], // 摘要压缩
  checkpointer: new MemorySaver(), // 短期记忆
});
```

## VectorStore 记忆工具

- 把历史记忆检索做成一个工具，让 agent 自己判断什么时候回忆
