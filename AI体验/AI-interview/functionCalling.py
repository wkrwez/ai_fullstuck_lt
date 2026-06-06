import json
from openai import OpenAI

# 初始化客户端 (这里使用你的 API Key)
client = OpenAI(api_key="sk-your-api-key")


# ==========================================
# 第一步：定义真实的业务函数 (后端执行的代码)
# 大模型看不见这部分代码，它只负责在本地运行
# ==========================================
def get_current_weather(location: str, unit: str = "celsius") -> str:
    """真实业务逻辑：调用第三方天气 API 或查询数据库"""
    print(f"\n⚙️ [系统后台] 正在执行真实函数... 查询 {location} 的天气...")
    # 这里用 Mock 数据代替真实的网络请求
    weather_data = {
        "location": location,
        "temperature": "25" if unit == "celsius" else "77",
        "unit": unit,
        "forecast": "晴朗，有微风",
    }
    return json.dumps(weather_data)


# 建立一个映射字典：把函数名(字符串) 映射到 真实的 Python 函数对象
available_functions = {
    "get_current_weather": get_current_weather,
}

# ==========================================
# 第二步：定义工具的 JSON Schema (给模型看的说明书)
# ==========================================
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "获取指定城市的当前天气情况。当用户询问天气、气温时调用此工具。",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "城市名称，例如：北京、上海、New York",
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位，默认使用摄氏度",
                    },
                },
                "required": ["location"],
            },
        },
    }
]


# ==========================================
# 第三步：核心调度流程 (系统如何串联一切)
# ==========================================
def run_conversation(user_prompt: str):
    # 1. 初始化对话历史
    messages = [{"role": "user", "content": user_prompt}]

    print(f"\n👤 [用户提问]: {user_prompt}")

    # 2. 【第一次调用模型】：传入用户问题和工具定义 (说明书)
    print("🚀 [系统] 正在将问题和工具定义发送给大模型...")
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools,  # <--- 核心：把工具定义传给模型
        tool_choice="auto",  # 让模型自己决定是否调用工具
    )

    response_message = response.choices[0].message

    # 3. 判断模型是否决定调用工具
    tool_calls = response_message.tool_calls

    if tool_calls:
        # 模型决定调用工具！它并没有查天气，而是吐出了 JSON 指令

        # 将模型的回复(包含调用指令)加入对话历史
        messages.append(response_message)

        # 4. 【系统拦截并执行真实代码】
        for tool_call in tool_calls:
            function_name = tool_call.function.name

            # 通过映射字典，找到对应的真实 Python 函数
            function_to_call = available_functions.get(function_name)

            # 解析模型传来的 JSON 参数
            function_args = json.loads(tool_call.function.arguments)
            print(
                f"🤖 [模型指令]: 模型要求调用 '{function_name}'，参数为: {function_args}"
            )

            # 执行真实的 Python 函数！
            function_response = function_to_call(
                location=function_args.get("location"),
                unit=function_args.get("unit"),
            )
            print(f"✅ [系统后台] 真实函数执行完毕，返回结果: {function_response}")

            # 5. 【将真实代码的执行结果喂回给模型】
            messages.append(
                {
                    "tool_call_id": tool_call.id,  # 必须关联对应的 tool_call_id
                    "role": "tool",  # 角色必须是 "tool"
                    "name": function_name,
                    "content": function_response,  # 把真实函数的返回值放在这里
                }
            )

        # 6. 【第二次调用模型】：带着工具执行结果，让模型生成最终的人类回复
        print("🚀 [系统] 正在将工具执行结果发回给大模型，请求总结...")
        second_response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,  # 此时的 messages 包含了：用户问题 + 模型调用指令 + 工具真实返回结果
            # tools=tools,     # 可选：如果工具可能连续调用，这里继续带上 tools
        )

        final_answer = second_response.choices[0].message.content
        print(f"🤖 [最终回复]: {final_answer}")
        return final_answer

    else:
        # 如果模型觉得不需要调用工具，直接返回文本
        print(f"🤖 [直接回复]: {response_message.content}")
        return response_message.content


# ==========================================
# 运行测试
# ==========================================
if __name__ == "__main__":
    user_input = (
        "帮我查一下今天北京天气怎么样？如果是摄氏度请告诉我，如果是华氏度也告诉我。"
    )
    run_conversation(user_input)


#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
#####################################################
from langchain_core.tools import tool


# 使用 @tool 装饰器，LangChain 会自动提取函数名、类型和注释生成 Schema
@tool
def check_inventory(product_name: str, size: str = "均码") -> str:
    """
    查询指定商品和尺码的库存情况。
    当用户询问某件商品是否有货、库存数量时使用此工具。
    """
    # ==========================================
    # 这里是你的真实业务逻辑 (查数据库/API)
    # ==========================================
    print(f"⚙️ [系统后台] 正在查询数据库: {product_name}, 尺码: {size}")

    # 模拟数据库返回
    mock_db = {"Nike跑鞋": {"42": 5, "43": 0}, "AdidasT恤": {"均码": 20}}

    stock = mock_db.get(product_name, {}).get(size, 0)
    if stock > 0:
        return f"有货，{product_name} ({size}) 目前还有 {stock} 件库存。"
    else:
        return f"抱歉，{product_name} ({size}) 已经售罄。"


from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent  # 推荐使用 LangGraph

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 创建一个 Agent，把模型和工具传进去
# LangGraph 会在底层自动处理所有的 tool_calls 循环和状态管理
agent_executor = create_react_agent(llm, tools=[check_inventory])

# 直接丢问题进去，Agent 会自动完成所有中间步骤
result = agent_executor.invoke(
    {
        "messages": [
            (
                "user",
                "帮我看看 42 码的 Nike跑鞋 还有没有货？如果没货，看看均码的 AdidasT恤 有没有",
            )
        ]
    }
)

# 打印最终结果
print(result["messages"][-1].content)
