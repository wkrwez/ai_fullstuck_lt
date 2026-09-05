import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";

import { HumanMessage, AIMessage } from "@langchain/core/messages";
// const prompt = ChatPromptTemplate.fromMessages([
//   [
//     "system",
//     "You are a helpful assistant that translates {input_language} to {output_language}",
//   ],
//   ["human", "{text}"],
// ]);

// 直接传递模板，无法插值变量
// const prompt = ChatPromptTemplate.fromMessages([
//   new SystemMessage(
//     "You are a helpful assistant that translates {input_language} to {output_language}",
//   ),
//   ["human", "{text}"],
// ]);

// const chat = await prompt.formatMessages({
//   input_language: "English",
//   output_language: "French",
//   text: "I love programming.",
// });

// console.log(chat);

// 元组
// const prompt = ChatPromptTemplate.fromMessages([
//   new SystemMessage("你有记忆"),
//   //   new MessagesPlaceholder("history"),
//   new MessagesPlaceholder({ variableName: "history", optional: true }), // history可选
//   ["human", "{text}"],
// ]);
// 元组简写
// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "你是有记忆的对话助手。"],
//   ["placeholder", "{history}"], // 等价于 MessagesPlaceholder("history")
//   ["human", "{text}"],
// ]);

// const chat = await prompt.formatMessages({
//   history: [new HumanMessage("你好，我是小米"), new AIMessage("我知道了")],
//   text: "我是谁？",
// });

/****************** 预定前置变量 *********************** */
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "你知道现在的时间{date}，还有随机数{count}。"],
  ["human", "{text}"],
]);

// 前置变量
const partialPrompt = await prompt.partial({
  date: new Date().toString(),
  count: () => Math.random().toString(), // 动态注入，每次 format 重新计算
});

const messages = await partialPrompt.formatMessages({
  text: "现在什么时间",
});

console.log(messages);
