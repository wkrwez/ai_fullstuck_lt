const path = require("path");
const filename = "./a/b/index.js";

const res = path.extname(filename);

const str = path.basename(filename, res);

console.log(str, res);
