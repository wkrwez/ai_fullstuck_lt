const agt = ['里皮','梅西','劳塔罗','圣马丁']
// 一次性的解构出来 解构  
//按照顺序解
// const [captain,mx] = agt  //加一个变量可以多解构一个
const [captain,...players] = agt  //...player 会解构出剩下所有的元素
console.log(...players);