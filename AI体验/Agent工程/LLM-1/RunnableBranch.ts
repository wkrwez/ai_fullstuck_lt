import { RunnableBranch } from "@langchain/core/runnables";

const branch = RunnableBranch.from([
  [async (input) => input.type === "question", questionChain],
  [(input) => input.type === "answer", answerChain],
  defaultChain, // 默认
]);
