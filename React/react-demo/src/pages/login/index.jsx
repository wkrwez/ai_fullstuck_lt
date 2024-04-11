import React from 'react';
import { Form, Input, Button,Select } from 'antd';
import { useNavigate } from 'react-router-dom'


const Login = props => {
    const navigate = useNavigate()

    const onFinish = ()=>{

    }

    
    return (
        <div className='login'>
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} >
        <Form.Item label="Note">
         
        </Form.Item>
        <Form.Item label="Gender">
          
            <Select
                placeholder="Select a option and change input text above"
             
            >
              <Option value="male">male</Option>
              <Option value="female">female</Option>
            </Select>,
          
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
        </div>
    );
};

export default Login;