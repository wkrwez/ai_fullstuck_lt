<template>
    <div class="flex flex-col h-screen">
        <div
            class="flex flex-nowrap fixed w-full items-baseline top-0 px-6 py-4 bg-gray-100"
        >
            <div class="text-2xl font-bold">ChatGPT</div>
            <div class="ml-4 text-sm text-gray-500">
                基于 OpenAI 的 ChatGPT 自然语言模型人工智能对话
            </div>
            <div 
                @click="clickConfig()"
                class="ml-auto px-3 py-2 text-sm cursor-pinter hover:bg-white rounded-md">
                设置
            </div>
        </div>
        <div class="flex-1 mx-2 mt-20 mb-2">
            <div 
            v-for="item of messageList.filter((v) => v.role !== 'system')"
            class="group flex flex-col px-4 py-3 hover:bg-slat-100 round-lg">
                <div class="flex justify-between items-center mb-2">
                    <div class="font-bold">{{roleAlias[item.role]}}</div>
                    <div></div>
                </div>
                <div>
                    <div class="prose text-sm text-slate-600 leading-relaxed">
                        {{ item.content }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="sticky bottom-0 w-full p-6 pb-8 bg-gray-100">
        <div class="-mt-2 mb-2 text-sm text-gray-500" v-if="isConfig">请输入API Key:</div>
        <div class="flex">
            <input
                class="input" 
                :type="isConfig?'password':'text'"
                :placeholder="isConfig?'sk-xxxxxxxx':'请输入'"
                v-model="messageContent"
                @keydown.enter=""
            >
            <button 
                class="btn" 
                @click="sendOrSave()"
            >
                {{isConfig?'保存':'发送'}}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import cryptoJS from "crypto-js";
import { ref, onMounted } from 'vue'
import type {ChatMessage} from '@/types'
let isConfig = ref(true);
let messageContent = ref("");
let apiKey = "";
let isTalking = ref(false);

onMounted(() => {
    if (getAPIKey()) {
        switchConfigStatus();
    }
})

const getSecretKey = () => 'lianginx';

const getAPIKey = () => {
    if (apiKey) return apiKey;
    const aesAPIKey = localStorage.getItem("aesAPIKey")??"";
    apiKey = cryptoJS.AES.decrypt(aesAPIKey,
     getSecretKey()).toString(cryptoJS.enc.Utf8);
    return apiKey;
}
const clearMessageContent = () => {
    messageContent.value = "";
}
const switchConfigStatus = () => {
    isConfig.value = !isConfig.value;
}

const clickConfig = () => {
    if (!isConfig.value) {
        messageContent.value = getAPIKey();
    } else {
        clearMessageContent();
    }
    switchConfigStatus();
}

const saveAPIKey = (apiKey:string) => {
    if (apiKey.slice(0, 3) !== "sk-" || apiKey.length !== 51) {
        alert('api key 格式错误,请检查后重新输入')
        return false;
    }
    // 加密后的ApiKey 
    const aesAPIKey = 
        cryptoJS.AES.encrypt(apiKey, getSecretKey()).toString()
    localStorage.setItem("apiKey", aesAPIKey)
    return true;
}

const sendOrSave = () => {
    if (!messageContent.value.length) return;
    if (isConfig.value){
        if (saveAPIKey(messageContent.value.trim())) {
            switchConfigStatus();
        }
        clearMessageContent();
    } else {
        // chat with llm
        sendChatMessage();
    }
}

const roleAlias = { user: "ME", assistant: "ChatGPT", system: "System" };
const messageList = ref([
  {
    role: "system",
    content: "你是 ChatGPT，OpenAI 训练的大型语言模型，尽可能简洁地回答。",
  },
  {
    role: "assistant",
    content: `你好，我是AI语言模型，我可以提供一些常用服务和信息，例如：

1. 翻译：我可以把中文翻译成英文，英文翻译成中文，还有其他一些语言翻译，比如法语、日语、西班牙语等。

2. 咨询服务：如果你有任何问题需要咨询，例如健康、法律、投资等方面，我可以尽可能为你提供帮助。

3. 闲聊：如果你感到寂寞或无聊，我们可以聊一些有趣的话题，以减轻你的压力。

请告诉我你需要哪方面的帮助，我会根据你的需求给你提供相应的信息和建议。`,
  },
]);


const sendChatMessage = async(content:string = messageContent.value) => {
    try {
        isTalking.value = true;
        if (messageList.value.length === 2) {
            messageList.value.pop();
        }
        messageList.value.push({
            role: "user",
            content
        })
        clearMessageContent();
        messageList.value.push({
            role: "assistant",
            content: ""
        })
    } catch(e) {

    }
}
</script>

<style scoped>

</style>