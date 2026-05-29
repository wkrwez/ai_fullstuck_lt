/**
 * 字符串匹配 vs 数字匹配 —— 速度对比
 *
 * 测试场景：
 *   1. 数组中查找（线性搜索）
 *   2. Set 中查找（哈希查找）
 *   3. 对象属性查找
 *   4. 排序后二分查找
 *
 * 每个场景都会用 console.time / console.timeEnd 记录耗时。
 */

// ============================================================
// 准备工作：生成测试数据
// ============================================================

const DATA_SIZE = 1_000_000; // 100 万条数据

// 数字数组 & 字符串数组
const numArr = Array.from({ length: DATA_SIZE }, (_, i) => i);
const strArr = Array.from({ length: DATA_SIZE }, (_, i) => String(i));

// Set 结构
const numSet = new Set(numArr);
const strSet = new Set(strArr);

// 对象（用作哈希表）
const numObj = {};
const strObj = {};
for (let i = 0; i < DATA_SIZE; i++) {
  numObj[i] = true;
  strObj[String(i)] = true;
}

// 二分查找用到的已排序数组（数字和字符串的排序结果不同，按字典序 vs 数值序）
const sortedNumArr = [...numArr].sort((a, b) => a - b);
const sortedStrArr = [...strArr].sort();

// 要查找的目标值（在范围内的随机值）
const TARGET_NUM = Math.floor(DATA_SIZE * 0.618); // 黄金分割点附近
const TARGET_STR = String(TARGET_NUM);

console.log("=".repeat(60));
console.log(`数据规模：${DATA_SIZE.toLocaleString()} 条`);
console.log(`目标数字：${TARGET_NUM}，目标字符串："${TARGET_STR}"`);
console.log("=".repeat(60));

// ============================================================
// 场景 1：数组中线性查找 (indexOf / includes)
// ============================================================

console.log("\n【场景 1】数组线性查找 —— Array.prototype.includes");

console.time("  数字数组 includes");
numArr.includes(TARGET_NUM);
console.timeEnd("  数字数组 includes");

console.time("  字符串数组 includes");
strArr.includes(TARGET_STR);
console.timeEnd("  字符串数组 includes");

// ============================================================
// 场景 2：Set 哈希查找
// ============================================================

console.log("\n【场景 2】Set 哈希查找 —— Set.prototype.has");

console.time("  数字 Set has");
numSet.has(TARGET_NUM);
console.timeEnd("  数字 Set has");

console.time("  字符串 Set has");
strSet.has(TARGET_STR);
console.timeEnd("  字符串 Set has");

// ============================================================
// 场景 3：对象属性查找
// ============================================================

console.log("\n【场景 3】对象属性查找 —— in 操作符");

console.time("  数字 key in obj");
TARGET_NUM in numObj;
console.timeEnd("  数字 key in obj");

console.time("  字符串 key in obj");
TARGET_STR in strObj;
console.timeEnd("  字符串 key in obj");

// ============================================================
// 场景 4：二分查找
// ============================================================

console.log("\n【场景 4】二分查找（已排序数组）");

// 二分查找工具函数
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = (left + right) >>> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

console.time("  数字二分查找");
binarySearch(sortedNumArr, TARGET_NUM);
console.timeEnd("  数字二分查找");

console.time("  字符串二分查找");
binarySearch(sortedStrArr, TARGET_STR);
console.timeEnd("  字符串二分查找");

// ============================================================
// 场景 5：大规模重复匹配（多次查找取累计耗时）
// ============================================================

console.log("\n【场景 5】大规模重复匹配（10 万次查找累计耗时）");

const ITERATIONS = 100_000;
const randomIndices = Array.from({ length: ITERATIONS }, () =>
  Math.floor(Math.random() * DATA_SIZE),
);

// 预热：让 JIT 先跑一圈
for (let i = 0; i < Math.min(ITERATIONS, 1000); i++) {
  numArr.includes(randomIndices[i]);
  strArr.includes(String(randomIndices[i]));
  numSet.has(randomIndices[i]);
  strSet.has(String(randomIndices[i]));
}

console.time("  数字数组 includes ×100k");
for (let i = 0; i < ITERATIONS; i++) {
  numArr.includes(randomIndices[i]);
}
console.timeEnd("  数字数组 includes ×100k");

console.time("  字符串数组 includes ×100k");
for (let i = 0; i < ITERATIONS; i++) {
  strArr.includes(String(randomIndices[i]));
}
console.timeEnd("  字符串数组 includes ×100k");

console.time("  数字 Set has ×100k");
for (let i = 0; i < ITERATIONS; i++) {
  numSet.has(randomIndices[i]);
}
console.timeEnd("  数字 Set has ×100k");

console.time("  字符串 Set has ×100k");
for (let i = 0; i < ITERATIONS; i++) {
  strSet.has(String(randomIndices[i]));
}
console.timeEnd("  字符串 Set has ×100k");

// ============================================================
// 总结输出
// ============================================================

console.log("\n" + "=".repeat(60));
console.log("总结：");
console.log("  1. 数字比较是值比较（CPU 单条指令即可完成），速度极快");
console.log(
  "  2. 字符串比较需要逐字符对比，短字符串差异不大，长字符串差距明显",
);
console.log(
  "  3. 对于哈希结构（Set / 对象 key），JS 引擎内部会将数字转字符串，",
);
console.log("     因此数字 key 和字符串 key 的哈希查找速度基本持平");
console.log("  4. 二分查找中数字比较优势更明显（每次比较都是 O(1) vs O(n)）");
console.log(
  "  5. 实际选择：优先用 Set/Map（O(1)），其次考虑 key 类型对可读性的影响",
);
console.log("=".repeat(60));
