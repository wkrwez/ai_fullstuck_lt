// buffer-demo.ts
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const agent = createAgent({
  model: "anthropic:claude-sonnet-4-6",
  tools: [],
  systemPrompt: "你是一个简洁的助手，会记住用户提过的信息。",
  checkpointer: new MemorySaver(), //
});

const config = { configurable: { thread_id: "demo-thread-1" } }; // 每个会话的id

await agent.invoke(
  { messages: [{ role: "user", content: "我叫张三，今年 28" }] },
  config,
);

const r = await agent.invoke(
  { messages: [{ role: "user", content: "我多大了？" }] },
  config,
);

console.log(r.messages.at(-1)?.content);
// → "你 28 岁。"
