## 跨境电商
AI 开店
玩具店 -> 拼多多的海外版
- 翻译？ NLP 不用打开google 翻译，写程序
     pipeline('translate')
- 卖什么货？
- 卖多少钱
- 营销内容怎么写有搞头

- 如何让openai帮你开店？
    大模型（openai 接口调用） + Prompt Engineer （编写prompt）

## Prompt 工程
会问问题的人比解决问题的更nb
大模型超越了大部分人的能力

## openai 封装的过程
人生苦短 我用python
特别适合nlp
一个功能写法就一种
风格 缩进
def  get_response(prompt)：
     调用了openai库的Completions模块(其他模块).create方法
     向openai 发出网络请求
     completions = openai.Completions.create(
     engine = ，
     prompt = ,  吴恩达prompt
     temperature = 0
     max_tokens = 512
  )
  同步的  js  异步的
  print(completions)
  result = completions[0].choices.text
  return result