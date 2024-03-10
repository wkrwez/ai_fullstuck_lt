var a = {
    n:1
}
var b = a
// 先对a进行赋值，a的引用地址指向新的{n:2},旧地址为b使用，
// 所有a.x就相当于b.x,所有b就会添加上一个x。
 a.x = a = {
    n:2
 }


 console.log(a.x);
 console.log(b.x);
 console.log(b);