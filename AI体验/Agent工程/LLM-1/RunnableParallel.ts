import {
  RunnableParallel,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["human", "请把下面文本生成一段摘要：{text}"],
]);
// summaryChain 完整子链：prompt → model
const summaryChain = summaryPrompt.pipe(model);
// 写法1
const parallel = new RunnableParallel({
  summary: summaryChain,
  keyWords: keyWordsChain,
});

// 写法2,传递给pip，自动包装
const chain = prompt.pip({
  summary: summaryChain,
  keyWords: keyWordsChain,
});

const result = parallel.invoke({ text: "今天天气很好" }).pip((res) => {
  return `摘要：${res.summary}，关键字：${res.keyWords}`;
});

// RunnablePassthrough.assign会并行执行
const chain = RunnablePassthrough.assign({
  summary: summaryChain,
  keyWords: keyWordsChain,
}).pipe((input) => {
  // input 里面：原始输入字段 + summary + keyWords
  const { text, summary, keyWords } = input;
  return `原文：${text}\n摘要：${summary}\n关键词：${keyWords}`;
});

/******   func可以接收上游输入参数，并行错误兜底，防止并行链报错整个失败  ****** */
// const riskyBranch = new RunnableLambda({
//   func: async () => fetchExternalAPI(),
// }).withFallbacks([
//   // 失败时返回降级结果而不是抛异常
//   new RunnableLambda({ func: () => ({ error: "数据源暂不可用" }) }),
// ]);

// const resilient = new RunnableParallel({
//   safe: safeChain,
//   risky: riskyBranch,
// });
