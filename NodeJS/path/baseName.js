const path = require("path");
const filename = "./a/b/index.js";
const name = path.basename(filename, ".js");
console.log(name); // baseName
