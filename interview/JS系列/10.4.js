let parent = {
  name: "Tom",
  friends: ["foo", "bar", "baz"],
  age() {
    return 18;
  },
};

let child = Object.create(parent); // 浅拷贝
let child2 = Object.create(parent);

child.friends.push("xyz");
child.name = "增加";
console.log(child2.name);
// console.log(child2.add);
// console.log(child2);
