let parent = {
  name: "Tom",
  friends: ["foo", "bar", "baz"],
  age(age) {
    return age;
  },
};

function clone(origin) {
  let obj = Object.create(origin);
  obj.like = function () {
    return ["coding"];
  };
  return obj;
}

// let child = clone(parent);
// child.like = "111";
// let child2 = clone(parent);
// console.log(child2);
