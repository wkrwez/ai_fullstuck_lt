function isValid(s) {
  // write code here
  if (s.length === 1) return false;
  let obj = {
    "(": ")",
    "[": "]",
    "{": "}",
  };

  let res = [];
  for (let i = 0; i < s.length; i++) {
    let str = s[i];
    if (str === "(" || str === "{" || str === "[") {
      res.push(str);
    } else {
      let a = res.pop();
      if (obj[a] != str) return false;
    }
  }

  return res.length === 0;
}
console.log(isValid("{}()"));
