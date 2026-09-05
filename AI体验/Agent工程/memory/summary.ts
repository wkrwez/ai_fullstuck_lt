import { createAgent, summarizationMiddleware } from "langchain";
import { ChatAnthropic } from "@langchain/anthropic";
import { MemorySaver } from "@langchain/langgraph";

const agent = createAgent({
  model: "anthropic:claude-sonnet-4-6",
  tools: [],
  middleware: [
    summarizationMiddleware({
      // 压缩用的模型，给个便宜的就行
      model: new ChatAnthropic({ model: "claude-haiku-4-5" }),
      // 触发条件：消息数 >= 20（也可用 { tokens: 4000 } 按 token 触发）
      trigger: { messages: 20 },
      // 压缩后保留最近 6 条原始消息（也可用 { tokens: 2000 }）
      keep: { messages: 6 },
    }),
  ],
  checkpointer: new MemorySaver(),
});

const config = { configurable: { thread_id: "long-chat" } };
await agent.invoke(
  { messages: [{ role: "user", content: "我叫张三" }] },
  config,
);
