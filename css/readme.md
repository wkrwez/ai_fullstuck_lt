# 最高权重
    :deep(.uni-icons) {
		color: #fff !important;
	}

# 网格布局
display: grid; //设定网格
grid-template-columns: 2fr 2fr 2fr 2fr 1fr; //设置网格列数量和大小
grid-column-gap: 10rpx; //列的间隔

# 伪元素
&::after{
	content: '';
	display: block;						
}

# 绑定css并动态修改
1. 设定某个样式css：left: bind(nav);

    动态绑定: const nav = ref(10 + 'rpx');

    点击切换left的值：const change = ()=>{
    nav.value = 100 + 'rpx';
    }

    绑定点击事件：<view class="nav-item" 
        @click="changeNav(index)"                 
        :class="{'active': activeNum === index}" //动态修改类名
        v-for=" (item, index) in listNav" :key="index">
	    {{item}}
        </view>

2. 绑定图片地址
        :style="{backgroundImage: 
        `url(${userInfo.profile && userInfo.profile.               
            backgroundUrl})`}"

3. 父子组件动态绑定背景色
    子组件    :style="{backgroundColor: bgColor}"
    父组件：  bgColor="red"