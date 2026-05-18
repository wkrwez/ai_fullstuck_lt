class MyPromise {
  constructor(executor) {
    this.status = "pending";
    this.reason = undefined;
    this.value = undefined;
    this.onReject = [];
    this.onResolve = [];
    const resolve = (value) => {
      if (this.status === "pending") {
        this.status = "fulfilled";
        this.value = value;
        this.onResolve.forEach((fn) => fn(value));
      }
    };
    const reject = (reason) => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.reason = reason;
        this.onReject.forEach((fn) => fn(reason));
      }
    };
    executor(resolve, reject);
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    const myPromise = new MyPromise((resolve, reject) => {
      if (this.status === "fulfilled") {
        setTimeout(() => {
          try {
            const result = onFulfilled(this.value);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
      if (this.status === "rejected") {
        setTimeout(() => {
          try {
            const result = onRejected(this.reason);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
      if (this.status === "pending") {
        this.onReject.push((reason) =>
          setTimeout(() => {
            try {
              const result = onRejected(reason);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          }, 0),
        );
        this.onResolve.push((value) =>
          setTimeout(() => {
            try {
              const result = onFulfilled(value);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          }, 0),
        );
      }
    });
    return myPromise;
  }
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((promise) => {
        promise.then(
          (value) => resolve(value),
          (reason) => reject(reason),
        );
      });
    });
  }
  static all(promiseArr) {
    return new MyPromise((resolve, reject) => {
      if (promiseArr.length === 0) resolve(promiseArr);
      let count = 0;
      let arr = [];
      promiseArr.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (value) => {
            count += 1;
            arr[index] = value;
            if (count === promiseArr.length) {
              resolve(arr);
            }
          },
          (reason) => {
            reject(reason);
          },
        );
      });
    });
  }
  // 重点抛出AggregateError，一个正确就resolve
  static any(promiseArr) {
    return new MyPromise((resolve, reject) => {
      if (promiseArr.length === 0)
        reject(new AggregateError([], "All promises were rejected"));
      let errArr = [],
        count = 0;
      promiseArr.forEach((value, index) =>
        MyPromise.resolve(value).then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            count += 1;
            errArr[index] = reason;
            if (count === promiseArr.length) {
              reject(new AggregateError(errArr, "All promises were rejected"));
            }
          },
        ),
      );
    });
  }
  // 等待所有结果返回，不会reject
  static allSettled(promiseArr) {
    return new MyPromise((resolve, reject) => {
      if (promiseArr.length === 0) resolve(promiseArr);
      let count = 0,
        arr = [];
      promiseArr.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (value) => {
            count += 1;
            arr[index] = { status: "fulfilled", value };
            if (count === promiseArr.length) resolve(arr);
          },
          (reason) => {
            count += 1;
            arr[index] = { status: "rejected", reason };
            if (count === promiseArr.length) resolve(arr); // 永远不会reject
          },
        );
      });
    });
  }
  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function a() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("a");
      resolve("a");
    }, 1000);
  });
}
function b() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("b");
      reject("b");
    }, 500);
  });
}

function c() {
  console.log("c");
}

MyPromise.all([a(), b()]).then((res) => {
  console.log(res);
});
