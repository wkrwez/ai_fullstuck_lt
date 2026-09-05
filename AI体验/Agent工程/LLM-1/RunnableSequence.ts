import { RunnablePassthrough } from "@langchain/core/runnables";

//
const chain = RunnablePassthrough.assign({
  // 在原始输入对象上挂一个新字段 answer
  answer: prompt.pipe(model).pipe(parser),
}).pipe(
  (input: { concept: string; answer: string }) =>
    `问题：${input.concept}\n回答：${input.answer}`,
);

const result = await chain.invoke({ concept: "量子纠缠" });
