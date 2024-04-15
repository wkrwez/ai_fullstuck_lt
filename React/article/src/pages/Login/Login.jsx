import React from 'react';
import { Card, message,Button, Checkbox, Form, Input } from 'antd'
import logo from '@/assets/7.jpeg'
import './index.scss'

import {useStore} from '@/store'
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [messageApi,contextHolder] = message.useMessage()
  const  {loginStore} = useStore()
  
  const onFinish = async(values) => {
    console.log('Success:', values);
    try{
      await loginStore.login(values)
      navigate('/')
    }catch(error){
      messageApi.open({
        type:'error',
        content:error.response?.data?.message || '登录失败'
      })
    }
  };

  return (
    <div className='login'>
      {contextHolder}

      <Card className='login-container'>
        <img className='login-logo' src={logo} alt="" />

        <Form 
          onFinish={onFinish} 
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember:true,
            username:'19195077082',
            password:'123456'
          }}
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入手机号',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号格式不对',
                validateTrigger: 'onBlur'
              }
            ]}
          >
            <Input size='large' placeholder='请输入账号'/>
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '密码不能为空',
              },
              {
                len:6,
                message:'密码长度应该为6位',
                validateTrigger:'onBlur'      
              }
            ]}
          >
            <Input.Password size='large' placeholder='请输入密码' />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{

            }}
          >
            <Checkbox className='login-checkbox-label'>
                我已阅读并同意「用户协议」和 「隐私条款」
            </Checkbox>
          </Form.Item>

          <Form.Item >
            <Button block size='large' type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

      </Card>
    </div>
  );
};

export default Login;