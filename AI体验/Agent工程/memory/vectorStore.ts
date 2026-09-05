import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ka } from "zod/v4/locales";

const embedding = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const vectorStore = new MemoryVectorStore(embedding);

// 工具1：检索历史
const recallMemory = tool(
  async ({ query }) => {
    const docs = await vectorStore.similaritySearch(query, 3);
    if (docs.length === 0) return "没有找到相关的历史记录";
    return docs.map((d, i) => `[${i + 1}] ${d.pageContent}`).join("\n");
  },
  {
    name: "recall_memory",
    description:
      "在用户的长期记忆里检索与当前问题语义相关的片段。当用户提到自己之前说过的内容、或问题涉及用户个人偏好/背景时调用。",
    schema: z.object({
      query: z.string().describe("要检索的关键词或问题，越具体越好"),
    }),
  },
);
// 工具2：保存历史
const saveMemory = tool(
  async ({ fact }) => {
    await vectorStore.addDocuments([
      new Document({
        pageContent: fact,
        metadata: {
          timestamp: Date.now(),
        },
      }),
    ]);
    return `记忆已保存:${fact}`;
  },
  {
    name: "save_memory",
    description:
      "把用户主动透露的、值得长期记住的事实写入记忆。例如姓名、职业、偏好、关键决定。寒暄和临时信息不要写入。",
    schema: z.object({
      fact: z.string().describe("一句话事实，不要带语气词"),
    }),
  },
);

const agent = createAgent({
  model: "gpt-3.5-turbo",
  tools: [recallMemory, saveMemory],
  systemPrompt: `
      你是一个助手，你需要根据用户的问题，从用户的长期记忆中检索相关的历史记录，并给出回答。
      如果你不知道如何回答，请使用"无法回答"来表示。
      如果你需要保存用户的信息，请使用save_memory工具。
      如果你需要检索用户的信息，请使用recall_memory工具。
      请使用"[fact]"来表示保存的信息，请使用"[query]"来表示检索的信息。`,
  checkpointer: new MemorySaver(),
});

const config = { configurable: { _thread_id: "demo" } };

await agent.invoke(
  {
    messages: [
      { role: "user", content: "我叫李华，在上海做全栈，主要用 React + Node" },
    ],
  },
  config,
);

await agent.invoke(
  {
    messages: [{ role: "user", content: "我周末喜欢跑步和看科幻小说" }],
  },
  config,
);

// 100 轮后……
const r = await agent.invoke(
  { messages: [{ role: "user", content: "推荐一本适合我的技术书" }] },
  config,
);
console.log(r.messages.at(-1)?.text);
// Agent 会先调 recall_memory("用户的技术背景") → 拿到"React + Node + 全栈"
// 然后给出针对性建议

/*********similaritySearch 检索调优***********/
// similaritySearch(query, k);  最简形态

//1. mmr: 兼顾相关性和多样性
const retriever = vectorStore.asRetriever({
  // lambda 越大，越关注相关性，越小，越关注多样性
  k: 5,
  searchType: "mmr",
  searchKwargs: { fetchK: 20, lambda: 0.7 },
});

// 2. metadata 过滤
const docs = await vectorStore.similaritySearch("加班", 3, {
  userId: "user-001", // 只看这个用户的记忆
});

/*********淘汰策略***********/

// 1. TTL 定期清理
// 写入时记 ttl
await vectorStore.addDocuments([
  new Document({
    pageContent: fact,
    metadata: { ts: Date.now(), ttlDays: 90 },
  }),
]);

// 定期任务（pgvector 直接 SQL）
await pool.query(
  `DELETE FROM user_memories WHERE (metadata->>'ts')::bigint < $1`,
  [Date.now() - 90 * 24 * 3600 * 1000],
);

/*********容量上限 + LFU***********/

// 记录每条记忆的检索命中次数，超过容量时砍命中数最少的。需要向量库支持 metadata 更新——pgvector / Qdrant 都可以。
// 实际选型：
// - 客服、临时咨询场景 → TTL 30 天
// - 长期陪伴、教练类 → 重要性评分 + 容量上限
// - 知识沉淀类 → 全保留，靠分类标签管理
