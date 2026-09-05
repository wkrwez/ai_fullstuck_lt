import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

/****************
 * 
withStructuredOutput：请求阶段下发 Schema，模型生成时就强制输出 JSON（原生接口）

JsonOutputParser：模型自由生成文本，生成结束后本地代码再去抠 JSON、解析（后处理）。
 * 
 */

// 通译千问 (DashScope) OpenAI 兼容接口
const model = new ChatOpenAI({
  model: "qwen-plus",
  temperature: 0,
  apiKey: process.env.DASHSCOPE_API_KEY,
  configuration: {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
});

/* ========== JsonOutputParser ==========*/
// 通过提示词和示例去约束模型，遇到文本直接出错
// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "你是一个有帮助的助手。请按用户要求回答。\n{format_instructions}"],
//   ["human", "{text}"],
// ]);

// const parser = new JsonOutputParser();

// const chain = prompt.pipe(model).pipe(parser);

// try {
//   const result = await chain.invoke({
//     text: "请用JSON格式列出前端三大框架的名称、开发者、发布时间和核心特点。",
//     format_instructions: parser.getFormatInstructions(),
//   });
//   console.log(result);
// } catch (err: any) {}

/***********withStructuredOutput**************** */

const extractionSchema = z.object({
  name: z.string().describe("名称"),
  developer: z.string().describe("开发者"),
});

// 显式声明用 functionCalling 方法
const structuredModel = model.withStructuredOutput(extractionSchema, {
  method: "functionCalling",
  includeRaw: true, //  返回模型原始数据
});

const result = await structuredModel.invoke(
  "我叫李华，今年 32 岁，是一名全栈工程师，精通 TypeScript、Go 和 Rust。",
);

console.log(result); //{ name: '全栈工程师', developer: '李华' }
