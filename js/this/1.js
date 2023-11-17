// let obj = {
//     name:'陈总',
//     say:function(){
//       console.log(this.name);         // (this.name)效果一样
//     }
// }
// obj.say()  //打印名字

//  function foo(){
//   var a= 1
//   console.log(this.a);
// }
// foo.b = 2
// foo()



let obj = {}
obj.a  //要是里面没有a就会添加一个a进去再读取   



 //不用this就需要一直传递,非常麻烦
// function identify(obj){
//   return obj.name.toUpperCase()  //英文小写转大写
// }
// function speek(obj){
//     var greeting ="Hello ,I'm " + identify(obj)
//     console.log(greeting);
// }
// var me = {
//   name:'tom'
// }
// speek(me)
 


//
// function identify(){
//   return this.name.toUpperCase()  //英文小写转大写
// }
// function speek(){
//     var greeting ="Hello ,I'm " + identify.call(this)
//     console.log(greeting);
// }
// var me = {
//   name:'Tom'
// }
// speek.call(me)





// let obj ={
//   this:this
// }