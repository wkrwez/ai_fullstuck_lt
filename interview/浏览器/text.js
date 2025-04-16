var A = 2;
let B = {
  f1: () => {
    return this.A;
  },
  f2: function () {
    return this.A;
  },
  A: 10,
};

// const f = B.f1;
// console.log(f());
console.log(B.f1(), B.f2()); // 输
