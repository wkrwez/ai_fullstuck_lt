// function foo(){
//     let a = 1
//     let b = 2

//     function bar(){
//         console.log(this.a);
//         console.log(a);
//     }

//     return bar
// }

// let baz = foo()

// baz()


//柯里化
// function add(a,b,c){
//     return a+b+c
// }

// function add(a){
//     return function(b){
//         return function(c){
//             return a+b+c
//         }
//     }
// }

// add(1)(2)(3)

// const str = "Hello world";

// console.log(str.endsWith("world", 5)); // 输出: true
// console.log(str.endsWith("world", 5));  // 输出: false

// let arr = [1,2,3]
// let res = arr.forEach((item) =>{
//     return item*2
// })
// console.log(arr);

let arr = [1, 2, 3]
let res = arr.map((item) => {
    return item * 2
})
console.log(res);




class KeyValueStore {
    constructor() { this.data = new Map(); }
    // 插入数据 
    insert(key, value, timestamp) {
        if (typeof key !== 'string' || typeof value !== 'string' || typeof timestamp !== 'number') {
            throw new Error('');
        }
        if (!this.data.has(key)) { this.data.set(key, []); }
        const keyValuePairs = this.data.get(key);
        keyValuePairs.push({ value, timestamp }); // 检查timestamp是否递增 
        for (let i = 1; i < keyValuePairs.length; i++) {
            if (keyValuePairs[i].timestamp <= keyValuePairs[i - 1].timestamp) {
                throw new Error('');
            }
        }
    } // 查询最新数据 
    getLatest(key) {
        if (!this.data.has(key)) {
            return null;
        }
        const keyValuePairs = this.data.get(key);
        return keyValuePairs[keyValuePairs.length - 1].value;
    } // 查询历史数据 
    getHistory(key, timestamp) {
        if (!this.data.has(key)) {
            return null;
        }
        const keyValuePairs = this.data.get(key);
        let result = null;
        for (let i = 0; i < keyValuePairs.length; i++) {
            if (keyValuePairs[i].timestamp <= timestamp) {
                result = keyValuePairs[i].value;
            }
            else { break; }
        }
        return result;
    }
} // 示例用法 
const store = new KeyValueStore();
store.insert('key1', 'value1', 1);
store.insert('key1', 'value2', 2);
store.insert('key1', 'value3', 3);
console.log(store.getLatest('key1')); // 输出: value3 console.log(store.getHistory('key1', 2)); // 输出: value2