import React from 'react';
import { Layout, Flex } from 'antd';
const { Header, Sider, Content } = Layout;
import "./index.css"
import {Outlet} from 'react-router-dom'

const LayoutWrap = () => {
    const data = [
        {id:1,title:'班级人员'},
        {id:1,title:'就业数据'},
        {id:1,title:'个人详情'}
    ]

  return (
    <div className='layout'>
      <Layout>
        <Header className='hd'>
            <h2>旅梦后台管理系统</h2>
            <p>欢迎</p>

        </Header>
        <Layout>
          <Sider width="200px" className='side'>
            {
                data.map(item=><li className='aside-item' >{item.title}</li>)
            }
          </Sider>
          <Content>Content</Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default LayoutWrap;