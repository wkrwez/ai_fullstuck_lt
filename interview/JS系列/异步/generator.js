// function* foo() {
//   yield 'a';
//   yield 'b';
//   return 'c';
// }
// let gen = foo();  //得到一个指向内部状态的指针对象
// console.log(gen.next());//{ value: 'a', done: false }
// console.log(gen.next());//{ value: 'b', done: false }
// console.log(gen.next());//{ value: 'c', done: true }
// console.log(gen.next());//{ value: undefined, done: true }
// console.log(gen.next());//{ value: undefined, done: true }
// console.log(gen.next());//{ value: undefined, done: true }


//赋值行为会暂停
// function* foo() {
//     var o = 1
//     yield o++
//     yield o++
// }
// let gen = foo();
// console.log(gen.next());//{ value: 1, done: false }
// console.log(gen.next());//{ value: 2, done: false }
// console.log(gen.next());//{ value: undefined, done: true }

function* foo() {
    var o = 1
    var a = yield o++
    console.log(a);
    yield o++
}
let gen = foo();    
console.log(gen.next());//a只是第一个yield的过客
console.log(gen.next(1));//第二个才有结果