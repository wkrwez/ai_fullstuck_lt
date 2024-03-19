<template>
    <div class="login">
    <h1>注册</h1>
    <div class="login-wrapper">
      <div class="avatar">
        <img src="https://pic2.zhimg.com/v2-4931987fac082f24a8ee95e19d1f2df9_r.jpg">
      </div>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
        <van-field 
          v-model="nickname" 
          name="nickname" 
          label="昵称" 
          placeholder="昵称"
           />
          <van-field 
          v-model="username" 
          name="username" 
          label="用户名" 
          placeholder="用户名"
          />
          <van-field 
          v-model="password" 
          type="password" 
          name="password" 
          label="密码" 
          placeholder="密码"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            注册
          </van-button>
        </div>
      </van-form>

    </div>
    <p class="register" @click = "goLogin">已有账号？点击登陆</p>
</div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import axios from '@/api'

const router = useRouter()
const nickname = ref('')
const username = ref('')
const password = ref('')


const goLogin = ()=>{
    router.push('/login')
}


const onSubmit = async(values)=>{
    console.log(values);
    const res = await axios.post('user/register',values)
    console.log(res);
    showSuccessToast(res.msg)
    setTimeout(()=>{
        router.push('/login')
    },2000)
}
</script>

<style lang="less" scoped>
.login{
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  padding: 0 0.3rem;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  h1{
    height: 0.6933rem;
    text-align: center;
    margin-top: 1.12rem;
    font-size: 0.48rem;
  }
  .login-wrapper{
    width: 7.44rem;
    height: 10.77rem;
    border: 1px solid rgba(187, 187, 187, 1);
    margin: 0 auto;
    margin-top: 1.7rem;
    border-radius: 0.3rem;
    box-shadow: 0 0 0.533rem 0 rgba(170, 170, 170, 1);
    .avatar{
      width: 2.4rem;
      height: 2.4rem;
      overflow: hidden;
      border-radius: 50%;
      margin: 1rem auto 0.77rem;
      img{
        width: 100%;
      }
    }
  }
  .register{
    position: absolute;
    bottom: 30px;
    width: 80%;
    left: 50%;
    text-align: center;
    font-size: 0.374rem;
    transform: translateX(-50%);
    height: 0.6rem;
    line-height: 0.6rem;
    color: rgba(16, 16, 16, 1);
  }
}
</style>

<style>
.van-cell__title.van-field__label{
  width: 45px;
}
</style>