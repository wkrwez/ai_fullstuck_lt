const rootNode = {
    value:1,
    children:[
        {
            value:2,
            children:[
                {
                    value:3,
                    children:[]
                },
                {
                    value:4,
                    children:[]
                }
            ]
        },
        {
            value:5,
            children:[]
        }
    ]
}



function dfs(node) {
    // 输出当前节点的值
    console.log(node.value);
    
    // 遍历当前节点的子节点
    for (let child of node.children) {
      // 对每个子节点递归执行深度优先搜索
      dfs(child);
    }
  }
  
  // 调用深度优先搜索函数，从根节点开始
  dfs(rootNode);




// function formatNumber(number) {
//     // 判断是否为负数
//     const isNegative = number < 0;
    
//     // 将数字转换成字符串并去掉负号
//     let numStr = Math.abs(number).toString();
    
//     // 分割整数部分和小数部分
//     let parts = numStr.split('.');
//     let intPart = parts[0];
//     let decimalPart = parts[1] || '';
    
//     // 对整数部分添加千分位分隔符
//     let formattedIntPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
//     // 组合整数部分和小数部分
//     let result = formattedIntPart;
//     if (decimalPart.length > 0) {
//         result += '.' + decimalPart;
//     }
    
//     // 添加负号（如果是负数）
//     if (isNegative) {
//         result = '-' + result;
//     }
    
//     return result;
// }

// // 测试
// console.log(formatNumber(1234567.89)); // 输出: "1,234,567.89"
// console.log(formatNumber(-0.1234)); // 输出: "-1,234,567.89"


// formatNumber(1000)// 1,000
// formatNumber(-10000)// -10,000
// formatNumber(123456)// 123,456
// formatNumber(-123456)// -123,456formatNumber(1234567.12)// 1,234,567.12formatNumber(-1234567.12)//-1,234,567.12formatNumber(-1234567.1234)//-1,234,567.1234formatNumber(0.1234)// 0.1234
// formatNumber(-0.1234)// -0.1234
  